import { TournamentRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
import { httpError } from '@/common';

export interface ICreateTournamentService {
  (ctx: {
    body: TournamentRequest
  }): Promise<void>;
}

export const createTournamentServiceFactory = (databaseService: IDatabaseService, uuid: v4String): ICreateTournamentService => {
  return async ({ body }) => {
    const tournamentId = uuid();
    try {
      await databaseService.saveTournament(tournamentId, body);
    } catch (error) {
      console.log('ERROR databaseService.saveTournament', error);
      throw httpError(500, 'Error while saving tournament');
    }
  };
};
