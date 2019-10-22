import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';
import { TeamDocument } from '@/types/documents';
import { Converter } from '@/types/types';

export interface IGetTeamService {
  (ctx: {
    teamId: string
  }): Promise<TeamResponse>;
}

export const getTeamServiceFactory = (
  databaseService: IDatabaseService,
  converter: Converter<TeamDocument, TeamResponse>
): IGetTeamService => {
  return async ({ teamId }) => {
    const team = await databaseService.queryTeamById(teamId).catch((error) => {
      console.log('ERROR databaseService.queryTeamById', error);
      throw httpError(500, 'Unable to query team');
    });

    return converter(team);
  };
};
