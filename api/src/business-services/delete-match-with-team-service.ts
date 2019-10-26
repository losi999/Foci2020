import { IDatabaseService } from '@/services/database-service';

export interface IDeleteMatchWithTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteMatchWithTeamServiceFactory = (databaseService: IDatabaseService): IDeleteMatchWithTeamService => {
  return async ({ teamId }) => {
    const matches = await databaseService.queryMatchKeysByTeamId(teamId);

    await Promise.all(matches.map(m => databaseService.deleteMatch(m.matchId)));
  };
};
