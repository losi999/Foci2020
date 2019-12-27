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
    const [home, away] = await Promise.all([
      matchDocumentService.queryMatchKeysByHomeTeamId(teamId),
      matchDocumentService.queryMatchKeysByAwayTeamId(teamId),
    ]);

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
