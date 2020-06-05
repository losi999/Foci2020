import { JSONSchema7 } from 'json-schema';
import { default as teamResponse } from '@foci2020/test/api/schemas/team-response';
import { default as tournamentResponse } from '@foci2020/test/api/schemas/tournament-response';
import { default as matchScore } from '@foci2020/shared/schemas/match-score';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    'homeTeam',
    'awayTeam',
    'tournament',
    'group',
    'matchId',
    'startTime',
  ],
  properties: {
    homeTeam: teamResponse,
    awayTeam: teamResponse,
    tournament: tournamentResponse,
    group: {
      type: 'string',
      minLength: 1
    },
    matchId: {
      type: 'string',
      format: 'uuid'
    },
    startTime: {
      type: 'string',
      format: 'date-time'
    },
    finalScore: matchScore
  }
};

export default schema;
