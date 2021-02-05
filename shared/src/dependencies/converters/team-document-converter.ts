import { v4 as uuid } from 'uuid';
import { teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';

export const teamDocumentConverter = teamDocumentConverterFactory(uuid);
