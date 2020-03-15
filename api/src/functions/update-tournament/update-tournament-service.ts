import { httpError } from '@/common';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentRequest } from '@/types/types';

export interface IUpdateTournamentService {
  (ctx: {
    tournamentId: string,
    body: TournamentRequest
  }): Promise<void>;
}

export const updateTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverter: ITournamentDocumentConverter
): IUpdateTournamentService => {
  return async ({ body, tournamentId }) => {
    const document = tournamentDocumentConverter.update(tournamentId, body);

    await tournamentDocumentService.updateTournament(document).catch((error) => {
      console.error('Update tournament', error);
      throw httpError(500, 'Error while updating tournament');
    });
  };
};
