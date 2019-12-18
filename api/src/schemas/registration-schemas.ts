import { JSONSchema7 } from 'json-schema';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'displayName',
    'password'
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    displayName: {
      type: 'string',
      minLength: 1
    },
    password: {
      type: 'string',
      minLength: 6
    }
  }
};
