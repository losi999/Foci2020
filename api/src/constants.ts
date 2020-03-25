import { Remove, InternalDocumentProperties, BetResult } from './types/types';

export const internalDocumentPropertiesToRemove: Remove<InternalDocumentProperties<never>> = {
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined
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
