import { v4 as uuid } from 'uuid';
import { tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';

export const tournamentDocumentConverter = tournamentDocumentConverterFactory(uuid);
