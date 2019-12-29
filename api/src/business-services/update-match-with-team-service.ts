import { IMatchDocumentService } from '@/services/match-document-service';
import { TeamDocument } from '@/types/documents';

export interface IUpdateMatchWithTeamService {
  (ctx: {
    teamId: string,
    team: TeamDocument
  }): Promise<void>;
}

export const updateMatchWithTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateMatchWithTeamService => {
  return async ({ team, teamId }) => {
    let home;
    let away;
    try {
      [home, away] = await Promise.all([
        matchDocumentService.queryMatchKeysByHomeTeamId(teamId),
        matchDocumentService.queryMatchKeysByAwayTeamId(teamId),
      ]);
    } catch (error) {
      console.log('QUERY MATCHES TO UPDATE ERROR', error, teamId);
      return;
    }

    await Promise.all([
      ...home.map(m => matchDocumentService.updateMatchWithTeam(m.id, team, 'home').catch((error) => {
        console.log('UPDATE MATCH ERROR', error, m.id);
        // TODO write to SQS?
      })),
      ...away.map(m => matchDocumentService.updateMatchWithTeam(m.id, team, 'away').catch((error) => {
        console.log('UPDATE MATCH ERROR', error, m.id);
        // TODO write to SQS?
      }))

    ]);
  };
};
