import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';
import { TeamDocument } from '@/types/documents';
import { Converter } from '@/types/types';

export interface IListTeamsService {
  (): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  databaseService: IDatabaseService,
  converter: Converter<TeamDocument, TeamResponse>
): IListTeamsService => {
  return async () => {
    const teams = await databaseService.queryTeams().catch((error) => {
      console.log('ERROR databaseService.queryTeams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teams.map<TeamResponse>(team => converter(team));
  };
};
