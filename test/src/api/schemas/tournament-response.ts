import { JSONSchema7 } from 'json-schema';
import { default as tournamentRequest } from '@foci2020/shared/schemas/tournament';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...tournamentRequest.required,
    'tournamentId',
  ],
  properties: {
    ...tournamentRequest.properties,
    tournamentId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
