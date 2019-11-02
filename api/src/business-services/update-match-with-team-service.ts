import { TeamDetailsUpdateDocument } from '@/types/documents';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateMatchWithTeamService {
  (ctx: {
    teamId: string,
    team: TeamDetailsUpdateDocument
  }): Promise<void>;
}

export const updateMatchWithTeamServiceFactory = (databaseService: IDatabaseService): IUpdateMatchWithTeamService => {
  return async ({ team, teamId }) => {
    const matches = await databaseService.queryMatchKeysByTeamId(teamId);

    await databaseService.updateMatchesWithTeam(matches, team);
  };
};
