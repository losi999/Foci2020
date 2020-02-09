import { httpError } from '@/common';
import { INotificationService } from '@/services/notification-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamRequest } from '@/types/types';

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
    const document = teamDocumentConverter.update(teamId, body);

    await teamDocumentService.updateTeam(teamId, document).catch((error) => {
      console.error('Update team', error);
      throw httpError(500, 'Error while updating team');
    });

    await notificationService.teamUpdated({
      teamId,
      team: document
    }).catch((error) => {
      console.error('Team updated', error);
      throw httpError(500, 'Unable to send team updated notification');
    });
  };
};
