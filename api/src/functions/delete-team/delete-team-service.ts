import { httpError } from '@/common';
import { IDatabaseService } from '@/services/database-service';

export interface IDeleteTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteTeamServiceFactory = (
  databaseService: IDatabaseService
): IDeleteTeamService => {
  return async ({ teamId }) => {
    await databaseService.deleteTeam(teamId).catch((error) => {
      console.error('Delete team', error);
      throw httpError(500, 'Unable to delete team');
    });
  };
};
