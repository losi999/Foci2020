import { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['matchId'],
  properties: {
    matchId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
