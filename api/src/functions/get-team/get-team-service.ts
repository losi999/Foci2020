import { httpError } from '@foci2020/shared/common/utils';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamResponse } from '@foci2020/shared/types/responses';

export interface IGetTeamService {
  (ctx: {
    teamId: string
  }): Promise<TeamResponse>;
}

export const getTeamServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter
): IGetTeamService => {
  return async ({ teamId }) => {
    const team = await databaseService.getTeamById(teamId).catch((error) => {
      console.error('Query team by Id', error);
      throw httpError(500, 'Unable to query team');
    });

    if (!team) {
      throw httpError(404, 'No team found');
    }

    return teamDocumentConverter.toResponse(team);
  };
};
