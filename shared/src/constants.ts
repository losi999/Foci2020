import { Remove, BetResult } from '@foci2020/shared/types/common';
import { InternalDocumentProperties } from '@foci2020/shared/types/documents';

export const internalDocumentPropertiesToRemove: Remove<InternalDocumentProperties<never>> = {
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined,
  expiresAt: undefined
};

type BetResultPoint = {
  [result in BetResult]: number;
};
export const betResultPoint: BetResultPoint = {
  nothing: 0,
  outcome: 1,
  goalDifference: 2,
  exactMatch: 3,
};

export const headerExpiresIn = 'Foci2020-ExpiresIn';
