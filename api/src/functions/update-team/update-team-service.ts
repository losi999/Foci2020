import { httpError } from '@foci2020/shared/common/utils';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamRequest } from '@foci2020/shared/types/requests';

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
      if (error.code === 'ConditionalCheckFailedException') {
        throw httpError(404, 'No team found');
      }
      throw httpError(500, 'Error while updating team');
    });
  };
};
