export type UserType = 'admin' | 'player';
export type Remove<T> = { [prop in keyof T]: undefined };
export type DocumentType = 'tournament' | 'team' | 'match' | 'bet' | 'standing';

export type Document = TournamentDocument | TeamDocument | MatchDocument | BetDocument | StandingDocument;

export type DocumentKey = {
  'documentType-id': string;
  id: string;
};

export type InternalDocumentProperties<T extends DocumentType = never> = DocumentKey & {
  documentType: T;
  orderingValue: string;
};

type IndexMatchIdDocumentType = {
  'matchId-documentType': string;
};

type IndexHomeTeamIdDocumentType = {
  'homeTeamId-documentType': string;
};

type IndexAwayTeamIdDocumentType = {
  'awayTeamId-documentType': string;
};

type IndexTournamentIdDocumentType = {
  'tournamentId-documentType': string;
};

type IndexByTournamentIdUserIdDocumentType = {
  'tournamentId-userId-documentType': string;
};

export type TournamentBase = {
  tournamentName: string;
};

export type TournamentId = {
  tournamentId: string;
};

export type TournamentRequest = TournamentBase;

export type TournamentDocument = TournamentBase
  & InternalDocumentProperties<'tournament'>;

export type TournamentResponse = TournamentBase
  & TournamentId
  & Remove<InternalDocumentProperties>;

export type TeamBase = {
  teamName: string
  shortName: string;
  image: string;
};

export type TeamId = {
  teamId: string;
};

export type TeamRequest = TeamBase;

export type TeamDocument = TeamBase
  & InternalDocumentProperties<'team'>;

export type TeamResponse = TeamBase
  & TeamId
  & Remove<InternalDocumentProperties>;

export type MatchBase = {
  startTime: string;
  group: string;
};

export type Score = {
  homeScore: number;
  awayScore: number;
};

export type MatchId = {
  matchId: string;
};

export type MatchTeamIds = {
  homeTeamId: string;
  awayTeamId: string;
};

export type MatchRequest = MatchBase
  & MatchTeamIds
  & TournamentId;

export type MatchFinalScoreRequest = Score;

export type MatchDocument = MatchBase
  & MatchTeamIds
  & TournamentId
  & IndexHomeTeamIdDocumentType
  & IndexAwayTeamIdDocumentType
  & IndexTournamentIdDocumentType
  & InternalDocumentProperties<'match'>
  & {
    homeTeam: TeamDocument;
    awayTeam: TeamDocument;
    tournament: TournamentDocument;
    finalScore?: Score;
  };

export type MatchResponse = MatchId
  & MatchBase
  & Remove<Score>
  & Remove<MatchTeamIds>
  & Remove<TournamentId>
  & Remove<IndexHomeTeamIdDocumentType>
  & Remove<IndexAwayTeamIdDocumentType>
  & Remove<IndexTournamentIdDocumentType>
  & Remove<InternalDocumentProperties>
  & {
    homeTeam: TeamResponse;
    awayTeam: TeamResponse;
    tournament: TournamentResponse;
    finalScore: Score;
  };

export type IndexByHomeTeamIdDocument = Pick<MatchDocument, keyof DocumentKey | 'homeTeamId'>;
export type IndexByAwayTeamIdDocument = Pick<MatchDocument, keyof DocumentKey | 'awayTeamId'>;

export type BetResult = 'nothing' | 'outcome' | 'goalDifference' | 'exactMatch';
export type BetResultPoint = {
  [result in BetResult]: number;
};

type BetBase = {
  userName: string;
  userId: string;
};

export type BetRequest = Score;

export type BetDocument = Score
  & BetBase
  & MatchId
  & TournamentId
  & IndexMatchIdDocumentType
  & IndexByTournamentIdUserIdDocumentType
  & InternalDocumentProperties<'bet'>
  & {
    result?: BetResult;
  };

export type BetResponse = (Score | Remove<Score>)
  & BetBase
  & Remove<MatchId>
  & Remove<TournamentId>
  & Remove<IndexMatchIdDocumentType>
  & Remove<IndexByTournamentIdUserIdDocumentType>
  & Remove<InternalDocumentProperties>
  & Remove<Pick<BetDocument, 'result'>>
  & {
    point: number;
  };

type StandingBase = {
  total: number;
  results: {
    [key in BetResult]: number;
  };
};

export type StandingDocument = StandingBase
  & BetBase
  & TournamentId
  & IndexTournamentIdDocumentType
  & InternalDocumentProperties<'standing'>;

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegistrationRequest = {
  email: string;
  displayName: string;
  password: string;
};

export type LoginResponse = {
  idToken: string;
  refreshToken: string;
};
