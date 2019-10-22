import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';

export interface IDeleteTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteTournamentServiceFactory = (
  databaseService: IDatabaseService,
): IDeleteTournamentService => {
  return async ({ tournamentId }) => {
    await databaseService.deleteTournament(tournamentId).catch((error) => {
      console.log('ERROR databaseService.deleteTournament', error);
      throw httpError(500, 'Unable to delete tournament');
    });

    return;
  };
};
