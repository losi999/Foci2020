import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';
import { ITeamDocumentService } from '@/services/team-document-service';

export interface IDeleteTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteTeamServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  notificationService: INotificationService
): IDeleteTeamService => {
  return async ({ teamId }) => {
    await teamDocumentService.deleteTeam(teamId).catch((error) => {
      console.log('ERROR databaseService.deleteTeam', error);
      throw httpError(500, 'Unable to delete team');
    });

    await notificationService.teamDeleted(teamId).catch((error) => {
      console.log('ERROR notificationService.teamDeleted', error);
      throw httpError(500, 'Unable to send team deleted notification');
    });
  };
};
