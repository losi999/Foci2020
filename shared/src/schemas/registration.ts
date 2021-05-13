import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { RegistrationRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<RegistrationRequest> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'displayName',
    'password',
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    displayName: {
      type: 'string',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};

export default schema;
