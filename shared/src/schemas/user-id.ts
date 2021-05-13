import { StrictJSONSchema7, UserId } from '@foci2020/shared/types/common';

const schema: StrictJSONSchema7<UserId> = {
  type: 'object',
  additionalProperties: false,
  required: ['userId'],
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
