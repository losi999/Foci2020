import { httpError } from '@/common';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamRequest } from '@/types/types';

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
      console.error('Save team', error);
      throw httpError(500, 'Error while saving team');
    });

    return document.id;
  };
};
