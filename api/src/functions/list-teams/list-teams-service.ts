import { httpError } from '@foci2020/shared/common/utils';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamResponse } from '@foci2020/shared/types/responses';

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
