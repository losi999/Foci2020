import { MatchIdType, TournamentIdType, UserIdType, TeamIdType } from '@foci2020/shared/types/common';
import { TournamentDocument, TeamDocument, MatchDocument, Document } from '@foci2020/shared/types/documents';

export type MatchDeletedEvent = {
  matchId: MatchIdType;
};

export type BetResultCalculatedEvent = {
  tournamentId: TournamentIdType;
  userId: UserIdType;
  expiresIn: number;
};

export type TournamentDeletedEvent = {
  tournamentId: TournamentIdType;
};

export type TournamentUpdatedEvent = {
  tournament: TournamentDocument
};

export type TeamUpdatedEvent = {
  team: TeamDocument;
};

export type TeamDeletedEvent = {
  teamId: TeamIdType;
};

export type MatchFinalScoreUpdatedEvent = {
  match: MatchDocument
};

export type ArchiveDocumentEvent = {
  document: Document;
};
