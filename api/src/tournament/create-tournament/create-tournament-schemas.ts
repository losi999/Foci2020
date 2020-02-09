import { JSONSchema7 } from 'json-schema';
import { tournament } from '@/shared/schemas/partials';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentName'],
  properties: {
    ...tournament
  }
};