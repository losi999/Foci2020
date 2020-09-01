import { TournamentBase, TeamBase, MatchBase, MatchTeamIds, TournamentId, Score } from '@foci2020/shared/types/common';

export type TournamentRequest = TournamentBase;

export type TeamRequest = TeamBase;

export type MatchRequest = MatchBase
    & MatchTeamIds
    & TournamentId;

export type MatchFinalScoreRequest = Score;

export type BetRequest = Score;

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegistrationRequest = {
  email: string;
  displayName: string;
  password: string;
};
