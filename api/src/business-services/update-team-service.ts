import { TeamRequest } from '@/types/requests';
import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';

export interface IUpdateTeamService {
  (ctx: {
    teamId: string,
    body: TeamRequest
  }): Promise<void>;
}

export const updateTeamServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter,
  notificationService: INotificationService): IUpdateTeamService => {
  return async ({ body, teamId }) => {
    const document = teamDocumentConverter.update(body);
    console.log('Updating team', teamId);
    const team = await teamDocumentService.updateTeam(teamId, document).catch((error) => {
      console.error('databaseService.updateTeam', error);
      throw httpError(500, 'Error while updating team');
    });
    console.log('Team updated, sending notification', teamId);
    await notificationService.teamUpdated({
      teamId,
      team
    }).catch((error) => {
      console.error('notificationService.teamUpdated', error);
      throw httpError(500, 'Unable to send team updated notification');
    });
    console.log('Team updated notification sent', teamId);
  };
};
