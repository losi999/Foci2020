import { httpError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentRequest } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface ICreateTournamentService {
  (ctx: {
    body: TournamentRequest
  }): Promise<string>;
}

export const createTournamentServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverter: ITournamentDocumentConverter): ICreateTournamentService => {
  return async ({ body }) => {
    const document = tournamentDocumentConverter.create(body);

    await databaseService.saveTournament(document).catch((error) => {
      console.error('Save tournament', error);
      throw httpError(500, 'Error while saving tournament');
    });

    return document.id;
  };
};
