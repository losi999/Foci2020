import { BetDocument, StandingDocument } from '@foci2020/shared/types/documents';
import { StandingResponse } from '@foci2020/shared/types/responses';
import { concatenate } from '@foci2020/shared/common/utils';
import { BetResult } from '@foci2020/shared/types/common';
import { betResultPoint } from '@foci2020/shared/constants';

export interface IStandingDocumentConverter {
  create(bets: BetDocument[]): StandingDocument;
  toResponseList(documents: StandingDocument[]): StandingResponse[];
}

const toFourDigit = (input: number) => String(input).padStart(4, '0');

export const standingDocumentConverterFactory = (): IStandingDocumentConverter => {
  const documentType: StandingDocument['documentType'] = 'standing';

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
    },
    toResponseList: documents => documents.map(d => ({
      ...d,
      'documentType-id': undefined,
      'tournamentId-documentType': undefined,
      documentType: undefined,
      id: undefined,
      orderingValue: undefined,
      tournamentId: undefined,
    }))
  };

  return instance;
};
