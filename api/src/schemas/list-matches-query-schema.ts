import { JSONSchema7 } from 'json-schema';

const queryStringParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tournamentId: {
      type: 'string',
      format: 'uuid'
    }
  }
};

export default queryStringParameters;
