import { httpError } from '@/common';
import { IDatabaseService } from '@/services/database-service';

export interface IDeleteTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteTournamentServiceFactory = (
  databaseService: IDatabaseService
): IDeleteTournamentService => {
  return async ({ tournamentId }) => {
    await databaseService.deleteTournament(tournamentId).catch((error) => {
      console.error('Delete tournament', error);
      throw httpError(500, 'Unable to delete tournament');
    });
  };
};
