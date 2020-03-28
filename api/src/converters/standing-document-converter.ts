import { StandingDocument, BetDocument, BetResult, DocumentType } from '@/types/types';
import { betResultPoint } from '@/constants';
import { concatenate } from '@/common';

export interface IStandingDocumentConverter {
  create(bets: BetDocument[]): StandingDocument;
}

const toFourDigit = (input: number) => String(input).padStart(4, '0');

export const standingDocumentConverterFactory = (): IStandingDocumentConverter => {
  const documentType: DocumentType = 'standing';

  const instance: IStandingDocumentConverter = {
    create: (bets) => {
      const userId = bets[0].userId;
      const tournamentId = bets[0].tournamentId;
      const userName = bets[0].userName;
      const id = concatenate(tournamentId, userId);
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
        userId,
        tournamentId,
        documentType,
        'tournamentId-documentType': concatenate(tournamentId, documentType),
        'documentType-id': concatenate(documentType, id),
        orderingValue: concatenate(toFourDigit(total), toFourDigit(exactMatch), toFourDigit(goalDifference), toFourDigit(outcome)),
        results: {
          nothing,
          outcome,
          goalDifference,
          exactMatch
        }
      };
    }
  };

  return instance;
};
