import { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamName', 'shortName'],
  properties: {
    teamName: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'string',
      format: 'uri',
    },
    shortName: {
      type: 'string',
      minLength: 3,
      maxLength: 3,
    },
  },
};

export default schema;
