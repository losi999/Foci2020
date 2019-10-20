export type MatchResponse = {
  matchId: string,
  startTime: Date,
  group: string,
  homeTeam: {
    teamId: string,
    teamName: string,
    shortName: string,
    image: string
  },
  awayTeam: {
    teamId: string,
    teamName: string,
    shortName: string,
    image: string
  },
  tournament: {
    tournamentId: string,
    tournamentName: string
  },
  finalScore?: {
    homeScore: number,
    awayScore: number
  }
};

export type TeamResponse = {
  teamId: string,
  teamName: string,
  shortName: string,
  image: string
};
