import { TournamentDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IUpdateTournamentOfMatchesService {
  (ctx: {
    tournamentId: string,
    tournament: TournamentDocument,
  }): Promise<void>;
}

export const updateTournamentOfMatchesServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateTournamentOfMatchesService => {
  return async ({ tournament, tournamentId }) => {
    const matchIds = (await matchDocumentService.queryMatchKeysByTournamentId(tournamentId).catch((error) => {
      console.error('Query matches by tournamentId', tournamentId, error);
      throw error;
    })).map(m => m.id);

    await matchDocumentService.updateTournamentOfMatches(matchIds, tournament).catch((error) => {
      console.error('Update tournament of matches', tournamentId, error);
      throw error;
    });
  };
};
