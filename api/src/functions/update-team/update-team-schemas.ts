import { JSONSchema7 } from 'json-schema';
import { team, teamId } from '@/schemas/partials';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamName', 'image', 'shortName'],
  properties: {
    ...team
  }
};

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamId'],
  properties: {
    ...teamId
  }
};
