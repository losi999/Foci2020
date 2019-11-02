import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

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
    const tournament = await databaseService.queryTournamentById(tournamentId).catch((error) => {
      console.log('ERROR databaseService.queryTournamentById', error);
      throw httpError(500, 'Unable to query tournament');
    });

    return tournamentDocumentConverte.createResponse(tournament);
  };
};
