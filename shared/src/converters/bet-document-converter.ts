import { BetDocument } from '@foci2020/shared/types/documents';
import { BetResponse } from '@foci2020/shared/types/responses';
import { BetRequest, MatchFinalScoreRequest } from '@foci2020/shared/types/requests';
import { concatenate, addSeconds } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove, betResultPoint } from '@foci2020/shared/constants';
import { KeyType, MatchIdType, TournamentIdType, UserIdType } from '@foci2020/shared/types/common';

export interface IBetDocumentConverter {
  toResponseList(documents: BetDocument[], userId?: UserIdType): BetResponse[];
  create(body: BetRequest, userId: UserIdType, userName: string, matchId: MatchIdType, tournamentId: TournamentIdType, expiresIn: number): BetDocument;
  calculateResult(bet: BetDocument, finalScore: MatchFinalScoreRequest): BetDocument;
}

export const betDocumentConverterFactory = (): IBetDocumentConverter => {
  const documentType: BetDocument['documentType'] = 'bet';

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
    create: (body, userId, userName, matchId, tournamentId, expiresIn) => {
      const betId = concatenate(userId, matchId);
      const now = new Date().toISOString();
      return {
        ...body,
        userId,
        userName,
        matchId,
        tournamentId,
        documentType,
        'documentType-id': concatenate(documentType, betId) as KeyType,
        'tournamentId-userId-documentType': concatenate(tournamentId, userId, documentType),
        'matchId-documentType': concatenate(matchId, documentType),
        id: betId,
        orderingValue: userName,
        expiresAt: expiresIn ? Math.floor(addSeconds(expiresIn).getTime() / 1000) : undefined,
        // createdAt: now,
        modifiedAt: now,
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
