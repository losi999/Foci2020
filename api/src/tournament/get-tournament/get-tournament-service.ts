import { httpError } from '@/shared/common';
import { ITournamentDocumentConverter } from '@/tournament/tournament-document-converter';
import { ITournamentDocumentService } from '@/tournament/tournament-document-service';
import { TournamentResponse } from '@/shared/types/types';

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
