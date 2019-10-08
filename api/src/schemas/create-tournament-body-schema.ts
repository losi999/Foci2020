import { JSONSchema7 } from 'json-schema';

const body: JSONSchema7 = {
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

export default body;
