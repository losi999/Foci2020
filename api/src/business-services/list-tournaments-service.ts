import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TournamentResponse } from '@/types/responses';

export interface IListTournamentsService {
  (ctx: {}): Promise<TournamentResponse[]>;
}

export const listTournamentsServiceFactory = (
  databaseService: IDatabaseService
): IListTournamentsService => {
  return async ({ }) => {
    const tournaments = await databaseService.queryTournaments().catch((error) => {
      console.log('ERROR databaseService.queryTournaments', error);
      throw httpError(500, 'Unable to query tournaments');
    });

    return tournaments.map<TournamentResponse>(({ tournamentId, tournamentName }) => ({
      tournamentId,
      tournamentName,
    }));
  };
};
