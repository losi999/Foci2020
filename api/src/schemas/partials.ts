import { JSONSchema7Definition } from 'json-schema';

type PartialSchema = {
  [key: string]: JSONSchema7Definition;
};

export const matchId: PartialSchema = {
  matchId: {
    type: 'string',
    format: 'uuid'
  }
};

export const tournamentId: PartialSchema = {
  tournamentId: {
    type: 'string',
    format: 'uuid'
  }
};

export const teamId: PartialSchema = {
  teamId: {
    type: 'string',
    format: 'uuid'
  }
};

export const match: PartialSchema = {
  ...tournamentId,
  startTime: {
    type: 'string',
    format: 'date-time'
  },
  group: {
    type: 'string',
    minLength: 1
  },
  homeTeamId: teamId.teamId,
  awayTeamId: teamId.teamId,
};

export const team: PartialSchema = {
  teamName: {
    type: 'string',
    minLength: 1,
  },
  image: {
    type: 'string',
    format: 'uri'
  },
  shortName: {
    type: 'string',
    minLength: 3,
    maxLength: 3
  }
};

export const tournament: PartialSchema = {
  tournamentName: {
    type: 'string',
    minLength: 1,
  }
};
