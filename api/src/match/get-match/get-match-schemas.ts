import { JSONSchema7 } from 'json-schema';
import { matchId } from '@/shared/schemas/partials';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['matchId'],
  properties: {
    ...matchId
  }
};
