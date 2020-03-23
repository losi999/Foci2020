import { httpError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

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
