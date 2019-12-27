import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITeamDocumentService } from '@/services/team-document-service';

export interface IListTeamsService {
  (): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter
): IListTeamsService => {
  return async () => {
    const teams = await teamDocumentService.queryTeams().catch((error) => {
      console.log('ERROR databaseService.queryTeams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teamDocumentConverter.toResponseList(teams);
  };
};
