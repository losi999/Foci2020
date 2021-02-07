import { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
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
    },
  },
};

export default schema;
