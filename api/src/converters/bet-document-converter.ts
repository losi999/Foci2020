import { BetDocument, BetRequest, BetResponse, MatchFinalScoreRequest, DocumentType } from '@/types/types';
import { internalDocumentPropertiesToRemove, betResultPoint } from '@/constants';
import { concatenate } from '@/common';

export interface IBetDocumentConverter {
  toResponseList(documents: BetDocument[], userId?: string): BetResponse[];
  create(body: BetRequest, userId: string, userName: string, matchId: string, tournamentId: string): BetDocument;
  calculateResult(bet: BetDocument, finalScore: MatchFinalScoreRequest): BetDocument;
}

export const betDocumentConverterFactory = (): IBetDocumentConverter => {
  const documentType: DocumentType = 'bet';

  const toResponse = (bet: BetDocument, hideScore: boolean): BetResponse => {
    return {
      ...bet,
      ...internalDocumentPropertiesToRemove,
      matchId: undefined,
      result: undefined,
      tournamentId: undefined,
      'tournamentId-userId-documentType': undefined,
      'matchId-documentType': undefined,
      homeScore: hideScore ? undefined : bet.homeScore,
      awayScore: hideScore ? undefined : bet.awayScore,
      point: hideScore ? undefined : betResultPoint[bet.result]
    };
  };
  const instance: IBetDocumentConverter = {
    create: (body, userId, userName, matchId, tournamentId) => {
      const betId = concatenate(userId, matchId);
      return {
        ...body,
        userId,
        userName,
        matchId,
        tournamentId,
        documentType,
        'documentType-id': concatenate(documentType, betId),
        'tournamentId-userId-documentType': concatenate(tournamentId, userId, documentType),
        'matchId-documentType': concatenate(matchId, documentType),
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

  return instance;
};
