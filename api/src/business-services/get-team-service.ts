import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';

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
    const team = await databaseService.queryTeamById(teamId).catch((error) => {
      console.log('ERROR databaseService.queryTeamById', error);
      throw httpError(500, 'Unable to query team');
    });

    return teamDocumentConverter.createResponse(team);
  };
};
