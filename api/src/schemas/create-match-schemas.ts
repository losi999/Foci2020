import { JSONSchema7 } from 'json-schema';

const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    'startTime',
    'group',
    'homeTeamId',
    'awayTeamId',
    'tournamentId'
  ],
  properties: {
    startTime: {
      type: 'string',
      format: 'date-time'
    },
    group: {
      type: 'string',
      minLength: 1
    },
    homeTeamId: {
      type: 'string',
      format: 'uuid'
    },
    awayTeamId: {
      type: 'string',
      format: 'uuid'
    },
    tournamentId: {
      type: 'string',
      format: 'uuid'
    },
  }
};

export default body;
