import { TournamentRequest } from '@/types/requests';
import { httpError } from '@/common';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

export interface ICreateTournamentService {
  (ctx: {
    body: TournamentRequest
  }): Promise<string>;
}

export const createTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverter: ITournamentDocumentConverter): ICreateTournamentService => {
  return async ({ body }) => {
    const document = tournamentDocumentConverter.create(body);

    await tournamentDocumentService.saveTournament(document).catch((error) => {
      console.log('ERROR databaseService.saveTournament', error);
      throw httpError(500, 'Error while saving tournament');
    });

    return document.id;
  };
};
