import { httpError } from '@/common';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

export interface IDeleteTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService
): IDeleteTournamentService => {
  return async ({ tournamentId }) => {
    await tournamentDocumentService.deleteTournament(tournamentId).catch((error) => {
      console.error('Delete tournament', error);
      throw httpError(500, 'Unable to delete tournament');
    });
  };
};
