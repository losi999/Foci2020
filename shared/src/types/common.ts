export type UserType = 'admin' | 'player';
export type Remove<T> = { [prop in keyof T]: undefined };
export type Brand<K, T> = K & { __brand: T };
export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends object ? RecursivePartial<T[P]> :
  T[P];
};

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
export type BetBase = {
  userName: string;
  userId: UserIdType;
};

export type StandingBase = {
  total: number;
  results: {
    [key in BetResult]: number;
  };
};
