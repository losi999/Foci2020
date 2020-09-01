import { JSONSchema7 } from 'json-schema';
import { default as score } from '@foci2020/shared/schemas/match-score';

const schema: JSONSchema7 = {
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    required: [
      'userId',
      'userName'
    ],
    properties: {
      ...score.properties,
      point: {
        type: 'integer',
        minimum: 0,
      },
      userId: {
        type: 'string',
        format: 'uuid'
      },
      userName: {
        type: 'string',
        minLength: 1
      }
    }
  }
};

export default schema;
