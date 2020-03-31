import { JSONSchema7 } from 'json-schema';
import { default as tournamentId } from '@/schemas/tournament-id';
import { default as userId } from '@/schemas/user-id';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...userId.required,
    ...tournamentId.required
  ],
  properties: {
    ...userId.properties,
    ...tournamentId.properties
  }
};
