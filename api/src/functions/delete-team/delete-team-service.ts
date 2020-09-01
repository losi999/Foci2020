import { httpError } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamIdType } from '@foci2020/shared/types/common';

export interface IDeleteTeamService {
  (ctx: {
    teamId: TeamIdType
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
