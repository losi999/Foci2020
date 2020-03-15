import { BetRequest } from '@/types/types';
import { IMatchDocumentService } from '@/services/match-document-service';
import { IBetDocumentService } from '@/services/bet-document-service';
import { addMinutes, httpError } from '@/common';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';

export interface IPlaceBetService {
  (ctx: {
    matchId: string;
    userId: string;
    userName: string;
    bet: BetRequest;
  }): Promise<void>;
}

export const placeBetServiceFactory = (
  matchDocumentService: IMatchDocumentService,
  betDocumentConverter: IBetDocumentConverter,
  betDocumentService: IBetDocumentService
): IPlaceBetService => {
  return async ({ bet, userId, matchId, userName }) => {
    const storedBet = await betDocumentService.queryBetById(userId, matchId).catch((error) => {
      console.error('Query bet', error);
      throw httpError(500, 'Unable to query bet');
    });

    if (storedBet) {
      throw httpError(400, 'You already placed a bet on this match');
    }

    const match = await matchDocumentService.queryMatchById(matchId).catch((error) => {
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

    await betDocumentService.saveBet(document).catch((error) => {
      console.error('Save bet', error);
      throw httpError(500, 'Unable to save bet');
    });
  };
};
