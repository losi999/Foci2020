import { StrictJSONSchema7, TournamentId } from '@foci2020/shared/types/common';

const schema: StrictJSONSchema7<TournamentId> = {
  type: 'object',
  additionalProperties: false,
  required: ['tournamentId'],
  properties: {
    tournamentId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

export default schema;
