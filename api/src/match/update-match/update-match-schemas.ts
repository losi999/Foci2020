import { JSONSchema7 } from 'json-schema';
import { match, matchId } from '@/shared/schemas/partials';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['matchId'],
  properties: {
    ...matchId
  }
};

export const body: JSONSchema7 = {
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
    ...match
  }
};
