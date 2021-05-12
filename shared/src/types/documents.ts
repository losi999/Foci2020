import { TournamentBase, TeamBase, MatchBase, MatchTeamIds, TournamentId, Score, BetBase, MatchId, Result, StandingBase, Brand, TournamentIdType, TeamIdType, MatchIdType, KeyType } from '@foci2020/shared/types/common';

export type DocumentKey = {
  'documentType-id': KeyType;
};

export type InternalDocumentProperties<Id extends Brand<any, any> = never, Doc extends DocumentType = never> = DocumentKey & {
  id: Id;
  documentType: Doc;
  orderingValue: string;
  expiresAt: number;
  modifiedAt: string;
};

export type DocumentType = 'tournament' | 'team' | 'match' | 'bet' | 'standing' | 'setting';

export type Document = TournamentDocument | TeamDocument | MatchDocument | BetDocument | StandingDocument | SettingDocument;

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
& Result;

export type StandingDocument = StandingBase
& BetBase
& TournamentId
& IndexTournamentIdDocumentType
& InternalDocumentProperties<string, 'standing'>;

export type SettingKey = 'defaultTournamentId';
export type SettingDocument = InternalDocumentProperties<SettingKey, 'setting'>
& {
  value: string;
};
