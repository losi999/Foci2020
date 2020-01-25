import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

export interface IGetTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<TournamentResponse>;
}

export const getTournamentServiceFactory = (
  tournamentDocumentService: ITournamentDocumentService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IGetTournamentService => {
  return async ({ tournamentId }) => {
    const tournament = await tournamentDocumentService.queryTournamentById(tournamentId).catch((error) => {
      console.error('Query tournament by Id', error);
      throw httpError(500, 'Unable to query tournament');
    });

    if (!tournament) {
      throw httpError(404, 'No tournament found');
    }

    return tournamentDocumentConverte.toResponse(tournament);
  };
};
