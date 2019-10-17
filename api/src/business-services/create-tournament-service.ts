import { TournamentRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { v4String } from 'uuid/interfaces';
import { httpError } from '@/common';

export interface ICreateTournamentService {
  (ctx: {
    body: TournamentRequest
  }): Promise<any>;
}

export const createTournamentServiceFactory = (databaseService: IDatabaseService, uuid: v4String): ICreateTournamentService => {
  return async ({ body }) => {
    try {
      const tournamentId = uuid();
      await databaseService.saveTournament({
        ...body,
        tournamentId,
        documentType: 'tournament',
        'documentType-id': `tournament-${tournamentId}`,
        segment: 'details',
        orderingValue: body.tournamentName
      });
    } catch (error) {
      console.log('ERROR databaseService.saveTournament', error);
      throw httpError(500, 'Error while saving tournament');
    }
  };
};
