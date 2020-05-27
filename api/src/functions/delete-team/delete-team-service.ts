import { httpError } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';

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
