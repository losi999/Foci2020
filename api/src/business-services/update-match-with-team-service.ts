import { IMatchDocumentService } from '@/services/match-document-service';
import { TeamDocument } from '@/types/documents';

export interface IUpdateMatchWithTeamService {
  (ctx: {
    matchId: string,
    team: TeamDocument,
    type: 'home' | 'away'
  }): Promise<void>;
}

export const updateMatchWithTeamServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateMatchWithTeamService => {
  return async ({ team, matchId, type }) => {
    console.log('Updating match with team', matchId);

    await matchDocumentService.updateMatchWithTeam(matchId, team, type)
      .catch((error) => {
        console.error('UPDATE MATCH WITH TEAM', error, matchId);
      });
    console.log('Match updated', matchId);
  };
};
