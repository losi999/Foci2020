import { BetDocument, BetRequest, BetResponse } from '@/types/types';
import { internalDocumentPropertiesToRemove } from '@/constants';

export interface IBetDocumentConverter {
  toResponseList(documents: BetDocument[], userId?: string): BetResponse[];
  create(body: BetRequest, userId: string, userName: string, matchId: string): BetDocument;
}

export const betDocumentConverterFactory = (): IBetDocumentConverter => {
  const toResponse = (bet: BetDocument, hideScore: boolean): BetResponse => {
    return {
      ...bet,
      ...internalDocumentPropertiesToRemove,
      matchId: undefined,
      homeScore: hideScore ? undefined : bet.homeScore,
      awayScore: hideScore ? undefined : bet.awayScore,
    };
  };
  return {
    create: (body, userId, userName, matchId) => {
      const betId = `${userId}-${matchId}`;
      return {
        ...body,
        userId,
        userName,
        matchId,
        'documentType-id': `bet-${betId}`,
        documentType: 'bet',
        id: betId,
        orderingValue: userName
      };
    },
    toResponseList: (bets, userId) => {
      return bets.map<BetResponse>(b => toResponse(b, userId && b.userId !== userId));
    }
  };
};
