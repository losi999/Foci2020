import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchFinalScoreUpdatedEvent } from '@foci2020/shared/types/events';

export interface IMatchFinalScoreUpdatedService {
  (ctx: MatchFinalScoreUpdatedEvent): Promise<void>;
}

export const matchFinalScoreUpdatedServiceFactory = (databaseService: IDatabaseService,
  betDocumentConverter: IBetDocumentConverter): IMatchFinalScoreUpdatedService => {

  return async ({ match }) => {
    const bets = await databaseService.queryBetsByMatchId(match.id).catch((error) => {
      console.error('Query bets of match', match.id, error);
      throw error;
    });

    const betsWithResult = bets.map(bet => betDocumentConverter.calculateResult(bet, match.finalScore));

    await databaseService.putDocuments(betsWithResult).catch((error) => {
      console.error('Bet update with result', match.id, error);
      throw error;
    });
  };
};
