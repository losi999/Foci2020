import { BetResponse } from '@/types/types';
import { IBetDocumentService } from '@/services/bet-document-service';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { httpError, addMinutes } from '@/common';

export interface IListBetsOfMatchService {
  (ctx: {
    matchId: string,
    userId: string,
  }): Promise<BetResponse[]>;
}

export const listBetsOfMatchServiceFactory = (
  betDocumentService: IBetDocumentService,
  betDocumentConverter: IBetDocumentConverter,
  matchDocumentService: IMatchDocumentService
): IListBetsOfMatchService =>
  async ({ matchId, userId }) => {
    const [match, bets] = await Promise.all([
      matchDocumentService.queryMatchById(matchId),
      betDocumentService.queryBetsByMatchId(matchId)
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
