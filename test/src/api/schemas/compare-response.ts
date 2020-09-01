import { JSONSchema7 } from 'json-schema';
import { default as matchScore } from '@foci2020/shared/schemas/match-score';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    'leftUserName',
    'rightUserName',
    'matches',
  ],
  properties: {
    leftUserName: {
      type: 'string',
      minLength: 1
    },
    rightUserName: {
      type: 'string',
      minLength: 1
    },
    matches: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'matchId',
          'homeFlag',
          'awayFlag',
        ],
        properties: {
          matchScore,
          matchId: {
            type: 'string',
            format: 'uuid'
          },
          leftScore: {
            type: 'object',
            additionalProperties: false,
            required: [
              ...matchScore.required
            ],
            properties: {
              ...matchScore.properties,
              result: {
                type: 'string',
                enum: [
                  'nothing',
                  'outcome',
                  'goalDifference',
                  'exactMatch'
                ]
              }
            }
          },
          rightScore: {
            type: 'object',
            additionalProperties: false,
            required: [
              ...matchScore.required
            ],
            properties: {
              ...matchScore.properties,
              result: {
                type: 'string',
                enum: [
                  'nothing',
                  'outcome',
                  'goalDifference',
                  'exactMatch'
                ]
              }
            }
          },
          homeFlag: {
            type: 'string',
            format: 'uri'
          },
          awayFlag: {
            type: 'string',
            format: 'uri'
          },
        }
      }
    },
  }
};

export default schema;
