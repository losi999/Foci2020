import { Remove, InternalDocumentProperties } from './types/types';

export const internalDocumentPropertiesToRemove: Remove<InternalDocumentProperties<never>> = {
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined
};
