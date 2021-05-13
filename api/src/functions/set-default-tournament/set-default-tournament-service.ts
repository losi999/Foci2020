import { httpError } from '@foci2020/shared/common/utils';
import { ISettingDocumentConverter } from '@foci2020/shared/converters/setting-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentIdType } from '@foci2020/shared/types/common';

export interface ISetDefaultTournamentService {
  (ctx: {
    tournamentId: TournamentIdType;
  }): Promise<void>;
}

export const setDefaultTournamentServiceFactory = (
  databaseService: IDatabaseService,
  settingDocumentConverter: ISettingDocumentConverter,
): ISetDefaultTournamentService => {
  return async ({ tournamentId }) => {
    const tournament = await databaseService.getTournamentById(tournamentId).catch((error) => {
      console.error('Get tournament by Id', error);
      throw httpError(500, 'Unable to get tournament');
    });

    if (!tournament) {
      throw httpError(404, 'No tournament found');
    }
    
    const document = settingDocumentConverter.create('defaultTournamentId', tournamentId);

    await databaseService.saveSetting(document).catch((error) => {
      console.error('Save setting', error);
      throw httpError(500, 'Unable to save setting');
    });
  };
};
