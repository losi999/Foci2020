import { httpError } from '@/shared/common';
import { ITeamDocumentConverter } from '@/team/team-document-converter';
import { ITeamDocumentService } from '@/team/team-document-service';
import { TeamResponse } from '@/shared/types/types';

export interface IGetTeamService {
  (ctx: {
    teamId: string
  }): Promise<TeamResponse>;
}

export const getTeamServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter
): IGetTeamService => {
  return async ({ teamId }) => {
    const team = await teamDocumentService.queryTeamById(teamId).catch((error) => {
      console.error('Query team by Id', error);
      throw httpError(500, 'Unable to query team');
    });

    if (!team) {
      throw httpError(404, 'No team found');
    }

    return teamDocumentConverter.toResponse(team);
  };
};
