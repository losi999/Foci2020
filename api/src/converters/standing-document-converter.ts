import { StandingDocument, BetDocument, BetResult } from '@/types/types';
import { betResultPoint } from '@/constants';
import { concatenate, getPartOfConcatenated } from '@/common';

export interface IStandingDocumentConverter {
  create(bets: BetDocument[]): StandingDocument;
}

export const standingDocumentConverterFactory = (): IStandingDocumentConverter => {
  return {
    create: (bets) => {
      const id = bets[0]['tournamentId-userId'];
      const tournamentId = getPartOfConcatenated(id, 0);
      const userName = bets[0].userName;
      const counts: { [prop in BetResult]: number } = {
        nothing: bets.filter(b => b.result === 'nothing').length,
        outcome: bets.filter(b => b.result === 'outcome').length,
        goalDifference: bets.filter(b => b.result === 'goalDifference').length,
        exactMatch: bets.filter(b => b.result === 'exactMatch').length,
      };

      const total = Object.keys(counts).reduce((accumulator, currentValue: BetResult) => {
        return accumulator + counts[currentValue] * betResultPoint[currentValue];
      }, 0);

      const { exactMatch, goalDifference, nothing, outcome } = counts;

      return {
        id,
        userName,
        total,
        documentType: 'standing',
        'documentType-id': concatenate('standing', id),
        orderingValue: concatenate(tournamentId, total, exactMatch, goalDifference, outcome),
        results: {
          nothing,
          outcome,
          goalDifference,
          exactMatch
        }
      };
    }
  };
};
