import { JSONSchema7 } from 'json-schema';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['matchId'],
  properties: {
    matchId: {
      type: 'string',
      format: 'uuid'
    }
  }
};
