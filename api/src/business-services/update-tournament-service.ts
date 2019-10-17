import { TournamentRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';

export interface IUpdateTournamentService {
  (ctx: {
    tournamentId: string,
    body: TournamentRequest
  }): Promise<any>;
}

export const updateTournamentServiceFactory = (databaseService: IDatabaseService): IUpdateTournamentService => {
  return async ({ body, tournamentId }) => {
    try {
      await databaseService.updateTournament({
        'documentType-id': `tournament-${tournamentId}`,
        segment: 'details'
      }, body);
    } catch (error) {
      console.log('ERROR databaseService.updateTournament', error);
      throw httpError(500, 'Error while updating tournament');
    }
  };
};
