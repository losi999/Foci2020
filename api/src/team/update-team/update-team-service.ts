import { httpError } from '@/shared/common';
import { ITeamDocumentService } from '@/team/team-document-service';
import { ITeamDocumentConverter } from '@/team/team-document-converter';
import { TeamRequest } from '@/shared/types/types';

export interface IUpdateTeamService {
  (ctx: {
    teamId: string,
    body: TeamRequest
  }): Promise<void>;
}

export const updateTeamServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter): IUpdateTeamService => {
  return async ({ body, teamId }) => {
    const document = teamDocumentConverter.update(teamId, body);

    await teamDocumentService.updateTeam(document).catch((error) => {
      console.error('Update team', error);
      throw httpError(500, 'Error while updating team');
    });
  };
};
