import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { LoginRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<LoginRequest> = {
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
  },
};

export default schema;
