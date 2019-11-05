export type DocumentKey<T = 'details'> = {
  'documentType-id': string;
  segment: T;
};

export type DocumentType = 'tournament' | 'team' | 'match' | 'bet' | 'standing';

type DocumentBase = {
  documentType: DocumentType;
  orderingValue: string;
};

export type TournamentDetailsUpdateDocument = {
  tournamentName: string
};

export type TournamentDetailsDocument = DocumentKey & TournamentDetailsUpdateDocument & DocumentBase & {
  documentType: 'tournament';
  tournamentId: string;
};

export type TournamentDocument = TournamentDetailsDocument;

export type IndexByTournamentIdDocument = Pick<MatchTournamentDocument, keyof DocumentKey | 'tournamentId' | 'documentType' | 'matchId'>;

export type TeamDetailsUpdateDocument = {
  teamName: string
  shortName: string;
  image: string;
};

export type TeamDetailsDocument = DocumentKey & TeamDetailsUpdateDocument & DocumentBase & {
  documentType: 'team';
  teamId: string;
};

export type TeamDocument = TeamDetailsDocument;

export type IndexByTeamIdDocument = Pick<MatchTeamDocument, keyof DocumentKey | 'teamId' | 'documentType' | 'matchId'>;

export type MatchDetailsUpdateDocument = {
  startTime: string;
  group: string;
};

export type MatchDetailsDocument = DocumentKey & DocumentBase & MatchDetailsUpdateDocument & {
  documentType: 'match';
  matchId: string;
};

export type MatchTeamUpdateDocument = {
  teamId: string;
  teamName: string
  shortName: string;
  image: string;
};

export type MatchTeamDocument = DocumentKey<'homeTeam' | 'awayTeam'> & DocumentBase & MatchTeamUpdateDocument & {
  documentType: 'match';
  matchId: string;
};

export type MatchTournamentUpdateDocument = {
  tournamentId: string;
  tournamentName: string
};

export type MatchTournamentDocument = DocumentKey<'tournament'> & DocumentBase & MatchTournamentUpdateDocument & {
  documentType: 'match';
  matchId: string;
};

export type MatchFinalScoreDocument = DocumentKey<'finalScore'> & DocumentBase & {
  documentType: 'match';
  matchId: string;
  homeScore: number;
  awayScore: number;
};

export type MatchDocument = MatchDetailsDocument | MatchTeamDocument | MatchTournamentDocument | MatchFinalScoreDocument;
