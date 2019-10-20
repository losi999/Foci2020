import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';

export interface IListTeamsService {
  (ctx: {}): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  databaseService: IDatabaseService
): IListTeamsService => {
  return async ({ }) => {
    const teams = await databaseService.queryTeams().catch((error) => {
      console.log('ERROR databaseService.queryTeams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teams.map<TeamResponse>(({ teamId, teamName, shortName, image }) => ({
      teamId,
      teamName,
      shortName,
      image
    }));
  };
};
