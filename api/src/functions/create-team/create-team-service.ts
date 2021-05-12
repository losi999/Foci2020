import { httpError } from '@foci2020/shared/common/utils';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamRequest } from '@foci2020/shared/types/requests';

export interface ICreateTeamService {
  (ctx: {
    body: TeamRequest;
    expiresIn: number;
  }): Promise<string>;
}

export const createTeamServiceFactory = (
  databaseService: IDatabaseService,
  teamDocumentConverter: ITeamDocumentConverter): ICreateTeamService => {
  return async ({ body, expiresIn }) => {
    const document = teamDocumentConverter.create(body, expiresIn);

    await databaseService.saveTeam(document).catch((error) => {
      console.error('Save team', error);
      throw httpError(500, 'Error while saving team');
    });

    return document.id;
  };
};
