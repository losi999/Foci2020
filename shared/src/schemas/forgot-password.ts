import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { ForgotPasswordRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<ForgotPasswordRequest> = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

export default schema;
