import { JSONSchema7 } from 'json-schema';
import { team } from '@/shared/schemas/partials';

export const body: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['teamName', 'image', 'shortName'],
  properties: {
    ...team
  }
};
