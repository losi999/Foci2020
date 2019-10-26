import { JSONSchema7 } from 'json-schema';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamName', 'image', 'shortName'],
  properties: {
    teamName: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'string',
      format: 'uri'
    },
    shortName: {
      type: 'string',
      minLength: 3,
      maxLength: 3
    }
  }
};
