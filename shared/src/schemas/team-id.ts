import { StrictJSONSchema7, TeamId } from '@foci2020/shared/types/common';

const schema: StrictJSONSchema7<TeamId> = {
  type: 'object',
  additionalProperties: false,
  required: ['teamId'],
  properties: {
    teamId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
