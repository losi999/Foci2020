import { JSONSchema7 } from 'json-schema';
import { default as teamResponse } from '@foci2020/test/api/schemas/team-response';

const schema: JSONSchema7 = {
  type: 'array',
  items: teamResponse,
};

export default schema;
