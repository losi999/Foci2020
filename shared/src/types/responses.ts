import { TournamentBase, TournamentId, Remove, TeamBase, TeamId, MatchId, MatchBase, MatchTeamIds, BetBase, StandingBase, Score, Result } from '@foci2020/shared/types/common';
import { InternalDocumentProperties, IndexHomeTeamIdDocumentType, IndexAwayTeamIdDocumentType, IndexTournamentIdDocumentType, IndexMatchIdDocumentType, IndexByTournamentIdUserIdDocumentType } from '@foci2020/shared/types/documents';

export type TournamentResponse = TournamentBase
& TournamentId
& Remove<InternalDocumentProperties>;

export type TeamResponse = TeamBase
& TeamId
& Remove<InternalDocumentProperties>;

export type MatchResponse = MatchId
& MatchBase
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

export type BetResponse = (Score | Remove<Score>)
& BetBase
& Result
& Remove<MatchId>
& Remove<TournamentId>
& Remove<IndexMatchIdDocumentType>
& Remove<IndexByTournamentIdUserIdDocumentType>
& Remove<InternalDocumentProperties>
& {
  point: number;
};

export type StandingResponse = StandingBase
& BetBase
& Remove<TournamentId>
& Remove<IndexTournamentIdDocumentType>
& Remove<InternalDocumentProperties>;

export type CompareResponse = {
  leftUserName: string
  rightUserName: string;
  matches: {
    matchId: string;
    leftScore: Score & Result;
    rightScore: Score & Result;
    matchScore: Score;
    homeFlag: string;
    awayFlag: string;
  }[];
};

export type LoginResponse = IdTokenResponse & {
  refreshToken: string;
};

export type IdTokenResponse = {
  idToken: string;
};
