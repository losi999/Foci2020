import { BetResponse } from '@/types/types';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { httpError, addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';

export interface IListBetsOfMatchService {
  (ctx: {
    matchId: string,
    userId: string,
  }): Promise<BetResponse[]>;
}

export const listBetsOfMatchServiceFactory = (
  databaseService: IDatabaseService,
  betDocumentConverter: IBetDocumentConverter
): IListBetsOfMatchService =>
  async ({ matchId, userId }) => {
    const [match, bets] = await Promise.all([
      databaseService.getMatchById(matchId),
      databaseService.queryBetsByMatchId(matchId)
    ]).catch((error) => {
      console.error('Query documents', error);
      throw httpError(500, 'Unable to query documents');
    });

    if (!match) {
      throw httpError(404, 'No match found');
    }

    const timeOfMatch = new Date(match.startTime);
    const hideScores = addMinutes(5) < timeOfMatch && !bets.some(b => b.userId === userId);

    return betDocumentConverter.toResponseList(bets, hideScores ? userId : undefined);
  };
