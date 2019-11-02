import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';

export interface IListTeamsService {
  (): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter
): IListTeamsService => {
  return async () => {
    const teams = await databaseService.queryTeams().catch((error) => {
      console.log('ERROR databaseService.queryTeams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teamDocumentConverter.createResponseList(teams);
  };
};
