import { JSONSchema7 } from 'json-schema';
import { tournament, tournamentId } from '@/schemas/partials';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentName'],
  properties: {
    ...tournament
  }
};

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentId'],
  properties: {
    ...tournamentId
  }
};
