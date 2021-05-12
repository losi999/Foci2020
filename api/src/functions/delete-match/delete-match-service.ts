import { httpError } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchIdType } from '@foci2020/shared/types/common';

export interface IDeleteMatchService {
  (ctx: {
    matchId: MatchIdType
  }): Promise<void>;
}

export const deleteMatchServiceFactory = (
  databaseService: IDatabaseService
): IDeleteMatchService => {
  return async ({ matchId }) => {
    await databaseService.deleteMatch(matchId).catch((error) => {
      console.error('Delete match', error);
      throw httpError(500, 'Unable to delete match');
    });
  };
};
