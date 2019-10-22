import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';
import { TournamentDocument } from '@/types/documents';
import { Converter } from '@/types/types';

export interface IListTournamentsService {
  (): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  databaseService: IDatabaseService,
  converter: Converter<TournamentDocument, TournamentResponse>
): IListTournamentsService => {
  return async () => {
    const tournaments = await databaseService.queryTournaments().catch((error) => {
      console.log('ERROR databaseService.queryTournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournaments.map<TournamentResponse>(tournament => converter(tournament));
  };
};
