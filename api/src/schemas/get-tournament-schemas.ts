import { JSONSchema7 } from 'json-schema';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentId'],
  properties: {
    tournamentId: {
      type: 'string',
      format: 'uuid'
    }
  }
};
