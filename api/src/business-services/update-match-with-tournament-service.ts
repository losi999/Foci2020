import { TournamentDetailsUpdateDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

export interface IUpdateMatchWithTournamentService {
  (ctx: {
    tournamentId: string;
    tournament: TournamentDetailsUpdateDocument
  }): Promise<void>;
}

export const updateMatchWithTournamentServiceFactory = (matchDocumentService: IMatchDocumentService): IUpdateMatchWithTournamentService => {
  return async ({ tournament, tournamentId }) => {
    const matches = await matchDocumentService.queryMatchKeysByTournamentId(tournamentId);

    await matchDocumentService.updateMatchesWithTournament(matches, tournament);
  };
};
