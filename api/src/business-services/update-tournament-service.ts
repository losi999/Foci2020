import { TournamentRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
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
        partitionKey: `tournament-${tournamentId}`,
        sortKey: 'details'
      }, body);
    } catch (error) {
      console.log('ERROR databaseService.saveTournament', error);
      throw httpError(500, 'Error while saving tournament');
    }
  };
};
