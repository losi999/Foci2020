import { MatchId, StrictJSONSchema7 } from '@foci2020/shared/types/common';

const schema: StrictJSONSchema7<MatchId> = {
  type: 'object',
  additionalProperties: false,
  required: ['matchId'],
  properties: {
    matchId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
