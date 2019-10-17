export type DocumentKey<T = 'details'> = {
  'documentType-id': string;
  segment: T;
};

type DocumentBase = {
  documentType: 'tournament' | 'team' | 'match' | 'bet' | 'standing';
  orderingValue: string;
};

export type TournamentUpdateDocument = {
  tournamentName: string
};

export type TournamentDocument = DocumentKey & TournamentUpdateDocument & DocumentBase & {
  documentType: 'tournament';
  tournamentId: string;
};
export type IndexByTournamentIdDocument = Pick<MatchTournamentDocument, keyof DocumentKey | 'tournamentId' | 'documentType'>;

export type TeamUpdateDocument = {
  teamName: string
  shortName: string;
  image: string;
};

export type TeamDocument = DocumentKey & TeamUpdateDocument & DocumentBase & {
  documentType: 'team';
  teamId: string;
};

export type IndexByTeamIdDocument = Pick<MatchTeamDocument, keyof DocumentKey | 'teamId' | 'documentType'>;

type MatchDetailsDocument = DocumentKey & DocumentBase & {
  documentType: 'match';
  matchId: string;
  startTime: string;
  group: string;
};

export type MatchTeamDocument = DocumentKey<'homeTeam' | 'awayTeam'> & DocumentBase & {
  documentType: 'match';
  teamId: string;
  matchId: string;
  teamName: string
  shortName: string;
  image: string;
};

export type MatchTournamentDocument = DocumentKey<'tournament'> & DocumentBase & {
  documentType: 'match';
  matchId: string;
  tournamentId: string;
  tournamentName: string
};

export type MatchFinalScoreDocument = DocumentKey<'finalScore'> & DocumentBase & {
  documentType: 'match';
  matchId: string;
  homeScore: number;
  awayScore: number;
};

export type MatchSaveDocument = [MatchDetailsDocument, MatchTeamDocument, MatchTeamDocument, MatchTournamentDocument];
export type MatchDocument = MatchDetailsDocument | MatchTeamDocument | MatchTeamDocument | MatchTournamentDocument | MatchFinalScoreDocument;
