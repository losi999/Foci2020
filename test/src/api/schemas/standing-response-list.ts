import { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    required: [
      'total',
      'results',
      'userId',
      'userName',
    ],
    properties: {
      total: {
        type: 'integer',
        minimum: 0,
      },
      results: {
        type: 'object',
        required: [
          'nothing',
          'outcome',
          'goalDifference',
          'exactMatch',
        ],
        properties: {
          nothing: {
            type: 'integer',
            minimum: 0,
          },
          outcome: {
            type: 'integer',
            minimum: 0,
          },
          goalDifference: {
            type: 'integer',
            minimum: 0,
          },
          exactMatch: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      userId: {
        type: 'string',
        format: 'uuid',
      },
      userName: {
        type: 'string',
        minLength: 1,
      },
    },
  },
};

export default schema;
