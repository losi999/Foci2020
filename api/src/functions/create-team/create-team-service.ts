import { httpError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamRequest } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

export interface ICreateTeamService {
  (ctx: {
    body: TeamRequest
  }): Promise<string>;
}

export const createTeamServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter): ICreateTeamService => {
  return async ({ body }) => {
    const document = teamDocumentConverter.create(body);

    await databaseService.saveTeam(document).catch((error) => {
      console.error('Save team', error);
      throw httpError(500, 'Error while saving team');
    });

    return document.id;
  };
};
