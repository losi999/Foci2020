import { JSONSchema7 } from 'json-schema';
import { default as teamRequest } from '@foci2020/shared/schemas/team';

const schema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...teamRequest.required,
    'teamId'
  ],
  properties: {
    ...teamRequest.properties,
    teamId: {
      type: 'string',
      format: 'uuid'
    }
  }
};

export default schema;
