import { JSONSchema7 } from 'json-schema';
import { match } from '@/shared/schemas/partials';

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
