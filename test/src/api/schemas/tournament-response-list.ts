import { JSONSchema7 } from 'json-schema';
import { default as tournamentResponse } from '@foci2020/test/api/schemas/tournament-response';

const schema: JSONSchema7 = {
  type: 'array',
  items: tournamentResponse,
};

export default schema;
