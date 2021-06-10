import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { MatchRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<MatchRequest> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'city',
    'startTime',
    'homeTeamId',
    'awayTeamId',
    'tournamentId',
  ],
  properties: {
    city: {
      type: 'string',
      minLength: 1,
    },
    stadium: {
      type: 'string',
      minLength: 1,
    },
    startTime: {
      type: 'string',
      format: 'date-time',
    },
    group: {
      type: 'string',
      minLength: 1,
    },
    homeTeamId: {
      type: 'string',
      format: 'uuid',
    },
    awayTeamId: {
      type: 'string',
      format: 'uuid',
    },
    tournamentId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
