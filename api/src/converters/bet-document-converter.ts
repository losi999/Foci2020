import { BetDocument, BetRequest, BetResponse, Score } from '@/types/types';
import { internalDocumentPropertiesToRemove, betResultPoint } from '@/constants';
import { concatenate } from '@/common';

export interface IBetDocumentConverter {
  toResponseList(documents: BetDocument[], userId?: string): BetResponse[];
  create(body: BetRequest, userId: string, userName: string, matchId: string, tournamentId: string): BetDocument;
  calculateResult(bet: BetDocument, finalScore: Score): BetDocument;
}

export const betDocumentConverterFactory = (): IBetDocumentConverter => {
  const toResponse = (bet: BetDocument, hideScore: boolean): BetResponse => {
    return {
      ...bet,
      ...internalDocumentPropertiesToRemove,
      matchId: undefined,
      result: undefined,
      'tournamentId-userId': undefined,
      homeScore: hideScore ? undefined : bet.homeScore,
      awayScore: hideScore ? undefined : bet.awayScore,
      point: hideScore ? undefined : betResultPoint[bet.result]
    };
  };
  return {
    create: (body, userId, userName, matchId, tournamentId) => {
      const betId = concatenate(userId, matchId);
      return {
        ...body,
        userId,
        userName,
        matchId,
        'documentType-id': concatenate('bet', betId),
        'tournamentId-userId': concatenate(tournamentId, userId),
        documentType: 'bet',
        id: betId,
        orderingValue: userName
      };
    },
    toResponseList: (bets, userId) => {
      return bets.map<BetResponse>(b => toResponse(b, userId && b.userId !== userId));
    },
    calculateResult: (bet, finalScore) => {
      if (bet.homeScore === finalScore.homeScore && bet.awayScore === finalScore.awayScore) {
        return {
          ...bet,
          result: 'exactMatch'
        };
      }
      if ((bet.homeScore - bet.awayScore) * (finalScore.homeScore - finalScore.awayScore) > 0) {
        if (bet.homeScore - bet.awayScore === finalScore.homeScore - finalScore.awayScore) {
          return {
            ...bet,
            result: 'goalDifference'
          };
        }
        return {
          ...bet,
          result: 'outcome'
        };
      }

      if (bet.homeScore === bet.awayScore && finalScore.homeScore === finalScore.awayScore) {
        return {
          ...bet,
          result: 'outcome'
        };
      }

      return {
        ...bet,
        result: 'nothing'
      };
    }
  };
};
