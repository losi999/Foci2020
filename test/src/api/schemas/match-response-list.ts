import { JSONSchema7 } from 'json-schema';
import { default as matchResponse } from '@foci2020/test/api/schemas/match-response';

const schema: JSONSchema7 = {
  type: 'array',
  items: matchResponse,
};

export default schema;
