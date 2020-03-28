import { httpError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface IListTeamsService {
  (): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter
): IListTeamsService => {
  return async () => {
    const teams = await databaseService.listTeams().catch((error) => {
      console.error('Query teams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teamDocumentConverter.toResponseList(teams);
  };
};
