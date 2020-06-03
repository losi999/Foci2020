export type UserType = 'admin' | 'player';
export type Remove<T> = { [prop in keyof T]: undefined };
export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends object ? RecursivePartial<T[P]> :
  T[P];
};

export type TournamentBase = {
  tournamentName: string;
};

export type TournamentId = {
  tournamentId: string;
};

export type TeamBase = {
  teamName: string
  shortName: string;
  image?: string;
};

export type TeamId = {
  teamId: string;
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

export type MatchId = {
  matchId: string;
};

export type MatchTeamIds = {
  homeTeamId: string;
  awayTeamId: string;
};

export type BetResult = 'nothing' | 'outcome' | 'goalDifference' | 'exactMatch';

export type BetBase = {
  userName: string;
  userId: string;
};

export type StandingBase = {
  total: number;
  results: {
    [key in BetResult]: number;
  };
};
