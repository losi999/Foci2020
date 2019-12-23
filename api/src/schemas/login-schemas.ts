import { JSONSchema7 } from 'json-schema';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'password',
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  }
};
