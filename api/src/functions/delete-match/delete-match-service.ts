import { httpError } from '@/common';
import { IDatabaseService } from '@/services/database-service';

export interface IDeleteMatchService {
  (ctx: {
    matchId: string
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
