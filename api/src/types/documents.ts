export type DocumentKey<T = 'details'> = {
  partitionKey: string;
  sortKey: T;
};

export type TeamUpdateDocument = {
  teamName: string
  shortName: string;
  image: string;
};

export type TeamDocument = DocumentKey & TeamUpdateDocument & {
  documentType: 'team';
  teamId: string;
};
export type TournamentUpdateDocument = {
  tournamentName: string
};
export type TournamentDocument = DocumentKey & TournamentUpdateDocument & {
  documentType: 'tournament';
  tournamentId: string;
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

export type MatchTournamentDocument = {
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

export type MatchSaveDocument = [MatchDetailsDocument, MatchTeamDocument, MatchTeamDocument, MatchTournamentDocument];
export type MatchDocument = MatchDetailsDocument | MatchTeamDocument | MatchTeamDocument | MatchTournamentDocument | MatchFinalScoreDocument;
