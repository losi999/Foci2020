import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { ConfirmForgotPasswordRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<ConfirmForgotPasswordRequest> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'confirmationCode',
    'password',
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    confirmationCode: {
      type: 'string',
      maxLength: 6,
      minLength: 6,
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};

export default schema;
