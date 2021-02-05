import { v4 as uuid } from 'uuid';
import { matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';

export const matchDocumentConverter = matchDocumentConverterFactory(uuid);
