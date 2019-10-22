import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';

export interface IDeleteTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteTeamServiceFactory = (
  databaseService: IDatabaseService,
): IDeleteTeamService => {
  return async ({ teamId }) => {
    await databaseService.deleteTeam(teamId).catch((error) => {
      console.log('ERROR databaseService.deleteTeam', error);
      throw httpError(500, 'Unable to delete team');
    });

    return;
  };
};
