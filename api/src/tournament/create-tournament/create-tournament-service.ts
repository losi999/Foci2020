import { httpError } from '@/shared/common';
import { ITournamentDocumentService } from '@/tournament/tournament-document-service';
import { ITournamentDocumentConverter } from '@/tournament/tournament-document-converter';
import { TournamentRequest } from '@/shared/types/types';

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
