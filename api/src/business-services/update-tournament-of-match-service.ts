import { TournamentDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IUpdateTournamentOfMatchService {
  (ctx: {
    matchId: string,
    tournament: TournamentDocument
  }): Promise<void>;
}

export const updateTournamentOfMatchServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateTournamentOfMatchService => {
  return async ({ tournament, matchId }) => {
    console.log('Updating match with tournament', matchId);

    await matchDocumentService.updateTournamentOfMatch(matchId, tournament)
      .catch((error) => {
        console.error('UPDATE MATCH WITH TOURNAMENT', error, matchId);
      });
    console.log('Match updated', matchId);
  };
};
