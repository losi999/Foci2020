import { httpError } from '@/common';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentRequest } from '@/types/types';

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
      console.error('Save tournament', error);
      throw httpError(500, 'Error while saving tournament');
    });

    return document.id;
  };
};