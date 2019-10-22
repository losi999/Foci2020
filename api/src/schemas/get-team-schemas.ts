import { JSONSchema7 } from 'json-schema';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamId'],
  properties: {
    teamId: {
      type: 'string',
      format: 'uuid'
    }
  }
};
