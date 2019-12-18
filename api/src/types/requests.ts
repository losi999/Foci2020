export type TeamRequest = {
  teamName: string;
  image: string;
  shortName: string;
};

export type TournamentRequest = {
  tournamentName: string;
};

export type MatchRequest = {
  startTime: string;
  group: string;
  homeTeamId: string;
  awayTeamId: string;
  tournamentId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegistrationRequest = {
  email: string;
  displayName: string;
  password: string;
};
