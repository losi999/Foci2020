import { JSONSchema7 } from 'json-schema';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentName'],
  properties: {
    tournamentName: {
      type: 'string',
      minLength: 1,
    }
  }
};

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
