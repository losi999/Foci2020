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

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    'homeScore',
    'awayScore',
  ],
  properties: {
    homeScore: {
      type: 'integer',
      minimum: 0,
    },
    awayScore: {
      type: 'integer',
      minimum: 0,
    }
  }
};
