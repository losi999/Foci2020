import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';
import { TournamentDocument } from '@/types/documents';
import { Converter } from '@/types/types';

export interface IGetTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<TournamentResponse>;
}

export const getTournamentServiceFactory = (
  databaseService: IDatabaseService,
  converter: Converter<TournamentDocument, TournamentResponse>
): IGetTournamentService => {
  return async ({ tournamentId }) => {
    const tournament = await databaseService.queryTournamentById(tournamentId).catch((error) => {
      console.log('ERROR databaseService.queryTournamentById', error);
      throw httpError(500, 'Unable to query tournament');
    });

    return converter(tournament);
  };
};
