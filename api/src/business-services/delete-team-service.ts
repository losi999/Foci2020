import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';

export interface IDeleteTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteTeamServiceFactory = (
  databaseService: IDatabaseService,
  notificationService: INotificationService
): IDeleteTeamService => {
  return async ({ teamId }) => {
    await databaseService.deleteTeam(teamId).catch((error) => {
      console.log('ERROR databaseService.deleteTeam', error);
      throw httpError(500, 'Unable to delete team');
    });

    await notificationService.teamDeleted(teamId).catch((error) => {
      console.log('ERROR notificationService.teamDeleted', error);
      throw httpError(500, 'Unable to send team deleted notification');
    });
  };
};
