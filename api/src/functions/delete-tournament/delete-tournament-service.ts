import { httpError } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';

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
