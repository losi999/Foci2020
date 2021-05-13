import { StrictJSONSchema7 } from '@foci2020/shared/types/common';
import { TournamentRequest } from '@foci2020/shared/types/requests';

const schema: StrictJSONSchema7<TournamentRequest> = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentName'],
  properties: {
    tournamentName: {
      type: 'string',
      minLength: 1,
    },
  },
};

export default schema;
