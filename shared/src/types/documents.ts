import { TournamentBase, TeamBase, MatchBase, MatchTeamIds, TournamentId, Score, BetBase, MatchId, Result, StandingBase, Brand, TournamentIdType, TeamIdType, MatchIdType } from '@foci2020/shared/types/common';

export type DocumentKey<Id extends Brand<any, any> = never> = {
  'documentType-id': string;
  id: Id;
};

export type InternalDocumentProperties<Id extends Brand<any, any> = never, Doc extends DocumentType = never> = DocumentKey<Id> & {
  documentType: Doc;
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
  & InternalDocumentProperties<TournamentIdType, 'tournament'>;

export type TeamDocument = TeamBase
  & InternalDocumentProperties<TeamIdType, 'team'>;

export type MatchDocument = MatchBase
  & MatchTeamIds
  & TournamentId
  & IndexHomeTeamIdDocumentType
  & IndexAwayTeamIdDocumentType
  & IndexTournamentIdDocumentType
  & InternalDocumentProperties<MatchIdType, 'match'>
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
  & InternalDocumentProperties<string, 'bet'>
  & Partial<Result>;

export type StandingDocument = StandingBase
  & BetBase
  & TournamentId
  & IndexTournamentIdDocumentType
  & InternalDocumentProperties<string, 'standing'>;
