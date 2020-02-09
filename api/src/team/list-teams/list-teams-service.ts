import { httpError } from '@/shared/common';
import { ITeamDocumentConverter } from '@/team/team-document-converter';
import { ITeamDocumentService } from '@/team/team-document-service';
import { TeamResponse } from '@/shared/types/types';

export interface IListTeamsService {
  (): Promise<TeamResponse[]>;
}

export const listTeamsServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter
): IListTeamsService => {
  return async () => {
    const teams = await teamDocumentService.queryTeams().catch((error) => {
      console.error('Query teams', error);
      throw httpError(500, 'Unable to query teams');
    });

    return teamDocumentConverter.toResponseList(teams);
  };
};
