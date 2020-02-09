import { JSONSchema7 } from 'json-schema';
import { teamId } from '@/shared/schemas/partials';

export const pathParameters: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamId'],
  properties: {
    ...teamId
  }
};
