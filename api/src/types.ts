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

export type TeamDocument = {
  partitionKey: string;
  sortKey: 'details';
  documentType: 'team';
  teamId: string;
  teamName: string
  shortName: string;
  image: string;
};

export type TournamentDocument = {
  partitionKey: string;
  sortKey: 'details';
  documentType: 'tournament';
  tournamentId: string;
  tournamentName: string
};

type MatchDetailsDocument = {
  partitionKey: string;
  sortKey: 'details';
  documentType: 'match';
  matchId: string;
  startTime: string;
  group: string;
};

type MatchTeamDocument = {
  partitionKey: string;
  sortKey: 'homeTeam' | 'awayTeam';
  documentType: 'match';
  teamId: string;
  matchId: string;
  teamName: string
  shortName: string;
  image: string;
};

type MatchTournamentDocument = {
  partitionKey: string;
  sortKey: 'tournament';
  documentType: 'match';
  matchId: string;
  tournamentId: string;
  tournamentName: string
};

export type MatchFinalScoreDocument = {
  partitionKey: string;
  sortKey: 'finalScore';
  documentType: 'match';
  matchId: string;
  homeScore: number;
  awayScore: number;
};

export type MatchDocument = [MatchDetailsDocument, MatchTeamDocument, MatchTeamDocument, MatchTournamentDocument];
