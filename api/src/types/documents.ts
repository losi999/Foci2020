export type DocumentKey = {
  'documentType-id': string;
  id: string;
};

export type DocumentType = 'tournament' | 'team' | 'match' | 'bet' | 'standing';

type DocumentBase<T extends DocumentType> = {
  documentType: T;
  orderingValue: string;
};

export type TournamentDocumentUpdatable = {
  tournamentName: string
};

export type TournamentDocument = DocumentKey & TournamentDocumentUpdatable & DocumentBase<'tournament'>;

export type TeamDocumentUpdatable = {
  teamName: string
  shortName: string;
  image: string;
};

export type TeamDocument = DocumentKey & TeamDocumentUpdatable & DocumentBase<'team'>;

export type MatchDocumentUpdatable = {
  homeTeamId: string;
  awayTeamId: string;
  tournamentId: string;
  homeTeam: TeamDocument;
  awayTeam: TeamDocument;
  tournament: TournamentDocument;
  startTime: string;
  group: string;
  homeScore?: number;
  awayScore?: number;
};

export type MatchDocument = DocumentKey & MatchDocumentUpdatable & DocumentBase<'match'>;

export type IndexByTournamentIdDocument = Pick<MatchDocument, keyof DocumentKey | 'tournamentId'>;
export type IndexByHomeTeamIdDocument = Pick<MatchDocument, keyof DocumentKey | 'homeTeamId'>;
export type IndexByAwayTeamIdDocument = Pick<MatchDocument, keyof DocumentKey | 'awayTeamId'>;
