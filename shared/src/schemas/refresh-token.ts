import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { RefreshTokenRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<RefreshTokenRequest> = {
  type: 'object',
  additionalProperties: false,
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

export default schema;
