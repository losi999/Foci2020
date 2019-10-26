import { JSONSchema7 } from 'json-schema';
import { tournamentId } from '@/schemas/partials';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentId'],
  properties: {
    ...tournamentId
  }
};
