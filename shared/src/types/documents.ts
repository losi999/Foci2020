import { TournamentBase, TeamBase, MatchBase, MatchTeamIds, TournamentId, Score, BetBase, MatchId, Result, StandingBase } from '@foci2020/shared/types/common';

export type DocumentKey = {
  'documentType-id': string;
  id: string;
};

export type InternalDocumentProperties<T extends DocumentType = never> = DocumentKey & {
  documentType: T;
  orderingValue: string;
  expiresAt: number;
};

export type DocumentType = 'tournament' | 'team' | 'match' | 'bet' | 'standing';

export type Document = TournamentDocument | TeamDocument | MatchDocument | BetDocument | StandingDocument;

export type IndexMatchIdDocumentType = {
  'matchId-documentType': string;
};

export type IndexHomeTeamIdDocumentType = {
  'homeTeamId-documentType': string;
};

export type IndexAwayTeamIdDocumentType = {
  'awayTeamId-documentType': string;
};

export type IndexTournamentIdDocumentType = {
  'tournamentId-documentType': string;
};

export type IndexByTournamentIdUserIdDocumentType = {
  'tournamentId-userId-documentType': string;
};

export type IndexByHomeTeamIdDocument = Pick<MatchDocument, keyof DocumentKey | 'homeTeamId'>;

export type IndexByAwayTeamIdDocument = Pick<MatchDocument, keyof DocumentKey | 'awayTeamId'>;

export type TournamentDocument = TournamentBase
  & InternalDocumentProperties<'tournament'>;

export type TeamDocument = TeamBase
  & InternalDocumentProperties<'team'>;

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

export type BetDocument = Score
  & BetBase
  & MatchId
  & TournamentId
  & IndexMatchIdDocumentType
  & IndexByTournamentIdUserIdDocumentType
  & InternalDocumentProperties<'bet'>
  & Partial<Result>;

export type StandingDocument = StandingBase
  & BetBase
  & TournamentId
  & IndexTournamentIdDocumentType
  & InternalDocumentProperties<'standing'>;
