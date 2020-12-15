import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchDeletedEvent } from '@foci2020/shared/types/events';

export interface IMatchDeletedService {
  (ctx: MatchDeletedEvent): Promise<void>;
}

export const matchDeletedServiceFactory = (databaseService: IDatabaseService): IMatchDeletedService => {
  return async ({ matchId }) => {
    const betKeys = (await databaseService.queryBetsByMatchId(matchId).catch((error) => {
      console.error('Query bets of match', matchId, error);
      throw error;
    })).map(b => b['documentType-id']);

    await databaseService.deleteDocuments(betKeys).catch((error) => {
      console.error('Delete bets of match', matchId, error);
      throw error;
    });
  };
};
