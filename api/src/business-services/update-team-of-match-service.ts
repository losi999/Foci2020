import { IMatchDocumentService } from '@/services/match-document-service';
import { TeamDocument } from '@/types/documents';

export interface IUpdateTeamOfMatchService {
  (ctx: {
    matchId: string,
    team: TeamDocument,
    type: 'home' | 'away'
  }): Promise<void>;
}

export const updateTeamOfMatchServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateTeamOfMatchService => {
  return async ({ team, matchId, type }) => {
    console.log('Updating match with team', matchId);

    await matchDocumentService.updateTeamOfMatch(matchId, team, type)
      .catch((error) => {
        console.error('UPDATE MATCH WITH TEAM', error, matchId);
      });
    console.log('Match updated', matchId);
  };
};
