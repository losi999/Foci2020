import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { MatchFinalScoreRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<MatchFinalScoreRequest> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'homeScore',
    'awayScore',
  ],
  properties: {
    homeScore: {
      type: 'integer',
      minimum: 0,
    },
    awayScore: {
      type: 'integer',
      minimum: 0,
    },
  },
};

export default schema;
