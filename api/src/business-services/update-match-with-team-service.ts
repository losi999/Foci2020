import { TeamDocument, IndexByTeamIdDocument } from '@/types/documents';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateMatchWithTeamService {
  (ctx: {
    team: TeamDocument
  }): Promise<void>;
}

export const updateMatchWithTeamServiceFactory = (databaseService: IDatabaseService): IUpdateMatchWithTeamService => {
  return async ({ team }) => {
    let matches: IndexByTeamIdDocument[];
    try {
      matches = await databaseService.queryMatchKeysByTeamId(team.teamId);
    } catch (error) {
      console.log('Unable to get matches by team', team.teamId, error);
      return;
    }
    try {
      await databaseService.updateMatchesWithTeam(matches, team);
    } catch (error) {
      console.log('Unable to update match', error);
      return;
    }
  };
};
