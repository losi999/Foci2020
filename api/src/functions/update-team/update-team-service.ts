import { httpError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamRequest } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IUpdateTeamService {
  (ctx: {
    teamId: string,
    body: TeamRequest
  }): Promise<void>;
}

export const updateTeamServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter): IUpdateTeamService => {
  return async ({ body, teamId }) => {
    const document = teamDocumentConverter.update(teamId, body);

    await databaseService.updateTeam(document).catch((error) => {
      console.error('Update team', error);
      throw httpError(500, 'Error while updating team');
    });
  };
};
