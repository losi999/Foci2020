import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { TeamRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<TeamRequest> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'teamName',
    'shortName',
  ],
  properties: {
    teamName: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'string',
      format: 'uri',
    },
    shortName: {
      type: 'string',
      minLength: 3,
      maxLength: 3,
    },
  },
};

export default schema;
