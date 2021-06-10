import { JSONSchema7 } from 'json-schema';

type JSONSchemaType<T> =
  T extends string ? 'string' :
    T extends number ? 'number' | 'integer' :
      T extends boolean ? 'boolean' :
        T extends any[] ? 'array' :
          'object';

export type StrictJSONSchema7<T> = Omit<JSONSchema7, 'properties' | 'type' | 'required' | 'items'> & {
  type: JSONSchemaType<T>;
  required?: JSONSchemaType<T> extends 'object' ? (keyof T)[] : never;
  properties?: JSONSchemaType<T> extends 'object' ? { [prop in keyof T]: StrictJSONSchema7<T[prop]> } : never;
  items?: T extends any[] ? StrictJSONSchema7<T[0]> : never;
};

export type UserType = 'admin' | 'player';
export type Remove<T> = { [prop in keyof T]: undefined };
export type Brand<K, T> = K & { __brand: T };
export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export type KeyType = Brand<string, 'key'>;

export type TournamentBase = {
  tournamentName: string;
};

export type TournamentIdType = Brand<string, 'tournamentId'>;
export type TournamentId = {
  tournamentId: TournamentIdType;
};

export type TeamBase = {
  teamName: string
  shortName: string;
  image?: string;
};

export type TeamIdType = Brand<string, 'teamId'>;
export type TeamId = {
  teamId: TeamIdType;
};

export type MatchBase = {
  startTime: string;
  group: string;
  stadium: string;
  city: string;
};

export type Score = {
  homeScore: number;
  awayScore: number;
};

export type Result = {
  result: BetResult;
};

export type MatchIdType = Brand<string, 'matchId'>;
export type MatchId = {
  matchId: MatchIdType;
};

export type MatchTeamIds = {
  homeTeamId: TeamIdType;
  awayTeamId: TeamIdType;
};

export type BetResult = 'nothing' | 'outcome' | 'goalDifference' | 'exactMatch';

export type UserIdType = Brand<string, 'userId'>;
export type UserId = {
  userId: UserIdType;
};
export type BetBase = UserId & {
  userName: string;
};

export type StandingBase = {
  total: number;
  results: {
    [key in BetResult]: number;
  };
};
