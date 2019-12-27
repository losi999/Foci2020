import { httpError } from '@/common';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITeamDocumentService } from '@/services/team-document-service';

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
      console.log('ERROR databaseService.queryTeamById', error);
      throw httpError(500, 'Unable to query team');
    });

    return teamDocumentConverter.toResponse(team);
  };
};
