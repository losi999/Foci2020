import { TeamRequest } from '@/types/requests';
import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';

export interface IUpdateTeamService {
  (ctx: {
    teamId: string,
    body: TeamRequest
  }): Promise<void>;
}

export const updateTeamServiceFactory = (databaseService: IDatabaseService, notificationService: INotificationService): IUpdateTeamService => {
  return async ({ body, teamId }) => {
    await databaseService.updateTeam(teamId, body).catch((error) => {
      console.log('ERROR databaseService.updateTeam', error);
      throw httpError(500, 'Error while updating team');
    });

    await notificationService.teamUpdated({
      teamId,
      team: body
    }).catch((error) => {
      console.log('ERROR notificationService.teamUpdated', error);
      throw httpError(500, 'Unable to send team updated notification');
    });
  };
};
