import { BetRequest } from '@/types/types';
import { addMinutes, httpError } from '@/common';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { IDatabaseService } from '@/services/database-service';

export interface IPlaceBetService {
  (ctx: {
    matchId: string;
    userId: string;
    userName: string;
    bet: BetRequest;
  }): Promise<void>;
}

export const placeBetServiceFactory = (
  databaseService: IDatabaseService,
  betDocumentConverter: IBetDocumentConverter
): IPlaceBetService => {
  return async ({ bet, userId, matchId, userName }) => {
    const storedBet = await databaseService.getBetById(userId, matchId).catch((error) => {
      console.error('Query bet', error);
      throw httpError(500, 'Unable to query bet');
    });

    if (storedBet) {
      throw httpError(400, 'You already placed a bet on this match');
    }

    const match = await databaseService.getMatchById(matchId).catch((error) => {
      console.error('Query match by id', error);
      throw httpError(500, 'Unable to query match by id');
    });

    if (!match) {
      throw httpError(404, 'No match found');
    }

    const timeOfMatch = new Date(match.startTime);

    if (timeOfMatch < addMinutes(5)) {
      throw httpError(400, 'Betting time expired');
    }

    const document = betDocumentConverter.create(bet, userId, userName, matchId, match.tournamentId);

    await databaseService.saveBet(document).catch((error) => {
      console.error('Save bet', error);
      throw httpError(500, 'Unable to save bet');
    });
  };
};
