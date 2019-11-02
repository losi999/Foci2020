import { TournamentRequest } from '@/types/requests';
import { v4String } from 'uuid/interfaces';
import { httpError } from '@/common';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

export interface ICreateTournamentService {
  (ctx: {
    body: TournamentRequest
  }): Promise<void>;
}

export const createTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  uuid: v4String): ICreateTournamentService => {
  return async ({ body }) => {
    const tournamentId = uuid();
    try {
      await tournamentDocumentService.saveTournament(tournamentId, body);
    } catch (error) {
      console.log('ERROR databaseService.saveTournament', error);
      throw httpError(500, 'Error while saving tournament');
    }
  };
};
