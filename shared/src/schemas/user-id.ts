import { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['userId'],
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
