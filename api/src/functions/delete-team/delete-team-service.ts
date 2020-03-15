import { httpError } from '@/common';
import { ITeamDocumentService } from '@/services/team-document-service';

export interface IDeleteTeamService {
  (ctx: {
    teamId: string
  }): Promise<void>;
}

export const deleteTeamServiceFactory = (
  teamDocumentService: ITeamDocumentService
): IDeleteTeamService => {
  return async ({ teamId }) => {
    await teamDocumentService.deleteTeam(teamId).catch((error) => {
      console.error('Delete team', error);
      throw httpError(500, 'Unable to delete team');
    });
  };
};
