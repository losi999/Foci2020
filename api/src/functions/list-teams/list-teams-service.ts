import { httpError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITeamDocumentService } from '@/services/team-document-service';
import { TeamResponse } from '@/types/types';

export interface IListTeamsService {
  (): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter
): IListTeamsService => {
  return async () => {
    const teams = await teamDocumentService.listTeams().catch((error) => {
      console.error('Query teams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teamDocumentConverter.toResponseList(teams);
  };
};
