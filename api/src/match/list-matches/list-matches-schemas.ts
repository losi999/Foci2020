import { JSONSchema7 } from 'json-schema';
import { tournamentId } from '@/shared/schemas/partials';

export const queryStringParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentId'],
  properties: {
    ...tournamentId
  }
};
