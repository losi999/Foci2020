import { httpError } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';

export interface IGetDefaultTournamentIdService {
  (): Promise<string>;
}

export const getDefaultTournamentIdServiceFactory = (
  databaseService: IDatabaseService,
): IGetDefaultTournamentIdService => {
  return async () => {
    const teams = await databaseService.getSettingByKey('defaultTournamentId').catch((error) => {
      console.error('Get setting by key', error);
      throw httpError(500, 'Unable to get setting');
    });

    return teams.value;
  };
};
