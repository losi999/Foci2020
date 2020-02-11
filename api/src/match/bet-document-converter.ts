import { BetDocument, BetRequest } from '@/shared/types/types';

export interface IBetDocumentConverter {
  create(body: BetRequest, userId: string, userName: string, matchId: string): BetDocument;
}

export const betDocumentConverterFactory = (): IBetDocumentConverter => {
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
    }
  };
};
