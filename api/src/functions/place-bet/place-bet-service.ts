import { addMinutes, httpError } from '@foci2020/shared/common/utils';
import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { BetRequest } from '@foci2020/shared/types/requests';

export interface IPlaceBetService {
  (ctx: {
    matchId: string;
    userId: string;
    userName: string;
    bet: BetRequest;
    isTestData: boolean
  }): Promise<void>;
}

export const placeBetServiceFactory = (
  databaseService: IDatabaseService,
  betDocumentConverter: IBetDocumentConverter
): IPlaceBetService => {
  return async ({ bet, userId, matchId, userName, isTestData }) => {
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

    const document = betDocumentConverter.create(bet, userId, userName, matchId, match.tournamentId, isTestData);

    await databaseService.saveBet(document).catch((error) => {
      console.error('Save bet', error);
      throw httpError(500, 'Unable to save bet');
    });
  };
};
