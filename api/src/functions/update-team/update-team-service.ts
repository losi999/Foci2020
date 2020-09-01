import { httpError } from '@foci2020/shared/common/utils';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamIdType } from '@foci2020/shared/types/common';

export interface IUpdateTeamService {
  (ctx: {
    teamId: TeamIdType;
    body: TeamRequest;
    expiresIn: number;
  }): Promise<void>;
}

export const updateTeamServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter): IUpdateTeamService => {
  return async ({ body, teamId, expiresIn }) => {
    const document = teamDocumentConverter.update(teamId, body, expiresIn);

    await databaseService.updateTeam(document).catch((error) => {
      console.error('Update team', error);
      if (error.code === 'ConditionalCheckFailedException') {
        throw httpError(404, 'No team found');
      }
      throw httpError(500, 'Error while updating team');
    });
  };
};
