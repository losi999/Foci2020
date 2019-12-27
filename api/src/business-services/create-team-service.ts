import { httpError } from '@/common';
import { TeamRequest } from '@/types/requests';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';

export interface ICreateTeamService {
  (ctx: {
    body: TeamRequest
  }): Promise<string>;
}

export const createTeamServiceFactory = (
  teamDocumentService: ITeamDocumentService,
  teamDocumentConverter: ITeamDocumentConverter): ICreateTeamService => {
  return async ({ body }) => {
    const document = teamDocumentConverter.create(body);

    await teamDocumentService.saveTeam(document).catch((error) => {
      console.log('ERROR databaseService.saveTeam', error);
      throw httpError(500, 'Error while saving team');
    });

    return document.id;
  };
};
