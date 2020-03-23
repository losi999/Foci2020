import { httpError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IGetTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<TournamentResponse>;
}

export const getTournamentServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverte: ITournamentDocumentConverter
): IGetTournamentService => {
  return async ({ tournamentId }) => {
    const tournament = await databaseService.getTournamentById(tournamentId).catch((error) => {
      console.error('Query tournament by Id', error);
      throw httpError(500, 'Unable to query tournament');
    });

    if (!tournament) {
      throw httpError(404, 'No tournament found');
    }

    return tournamentDocumentConverte.toResponse(tournament);
  };
};
