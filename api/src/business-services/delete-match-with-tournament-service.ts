import { IDatabaseService } from '@/services/database-service';

export interface IDeleteMatchWithTournamentService {
  (ctx: {
    tournamentId: string
  }): Promise<void>;
}

export const deleteMatchWithTournamentServiceFactory = (databaseService: IDatabaseService): IDeleteMatchWithTournamentService => {
  return async ({ tournamentId }) => {
    const matches = await databaseService.queryMatchKeysByTournamentId(tournamentId);

    await Promise.all(matches.map(m => databaseService.deleteMatch(m.matchId)));
  };
};
