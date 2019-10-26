import { IDatabaseService } from '@/services/database-service';
import { httpError } from '@/common';

export interface IDeleteMatchService {
  (ctx: {
    matchId: string
  }): Promise<void>;
}

export const deleteMatchServiceFactory = (
  databaseService: IDatabaseService,
): IDeleteMatchService => {
  return async ({ matchId }) => {
    await databaseService.deleteMatch(matchId).catch((error) => {
      console.log('ERROR databaseService.deleteMatch', error);
      throw httpError(500, 'Unable to delete match');
    });
  };
};
