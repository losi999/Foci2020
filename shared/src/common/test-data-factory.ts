import { TeamRequest, TournamentRequest, MatchRequest, BetRequest } from '@foci2020/shared/types/requests';
import { TeamDocument, TournamentDocument, MatchDocument, BetDocument, StandingDocument } from '@foci2020/shared/types/documents';
import { TeamResponse, TournamentResponse, MatchResponse, BetResponse, StandingResponse, CompareResponse } from '@foci2020/shared/types/responses';
import { RecursivePartial } from '@foci2020/shared/types/common';

export const teamRequest = (req?: Partial<TeamRequest>): TeamRequest => ({
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  ...req
});

export const teamDocument = (doc?: Partial<Pick<TeamDocument, keyof TeamRequest | 'id' | 'expiresAt'>>): TeamDocument => {
  const id = doc?.id ?? 'teamId';
  return {
    id,
    image: 'http://image.com',
    shortName: 'TMN',
    teamName: 'Team name',
    'documentType-id': `team#${id}`,
    documentType: 'team',
    orderingValue: 'Team name',
    expiresAt: undefined,
    ...doc,
  };
};

export const teamResponse = (res?: Partial<Pick<TeamResponse, keyof TeamRequest | 'teamId'>>): TeamResponse => ({
  teamId: 'teamId',
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined,
  expiresAt: undefined,
  ...res
});

export const tournamentRequest = (req?: Partial<TournamentRequest>): TournamentRequest => ({
  tournamentName: 'Tournament',
  ...req
});

export const tournamentDocument = (doc?: Partial<Pick<TournamentDocument, keyof TournamentRequest | 'id' | 'expiresAt'>>): TournamentDocument => {
  const id = doc?.id ?? 'tournamentId';
  return {
    id,
    tournamentName: 'Tournament',
    'documentType-id': `tournament#${id}`,
    documentType: 'tournament',
    orderingValue: 'Tournament',
    expiresAt: undefined,
    ...doc
  };
};

export const tournamentResponse = (res?: Partial<Pick<TournamentResponse, keyof TournamentRequest | 'tournamentId'>>): TournamentResponse => ({
  tournamentId: 'tournamentId',
  tournamentName: 'Tournament',
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined,
  expiresAt: undefined,
  ...res
});

export const matchRequest = (req?: Partial<MatchRequest>): MatchRequest => ({
  awayTeamId: 'awayTeamId',
  homeTeamId: 'homeTeamId',
  tournamentId: 'tournamentId',
  group: 'Group',
  startTime: 'startTime',
  ...req
});

export const matchDocument = (doc?: Partial<Pick<MatchDocument, 'startTime' | 'group' | 'id' | 'finalScore' | 'homeTeam' | 'awayTeam' | 'tournament' | 'expiresAt'>>): MatchDocument => {
  const homeTeam = doc?.homeTeam ?? teamDocument({ id: 'homeTeamId' });
  const awayTeam = doc?.awayTeam ?? teamDocument({ id: 'awayTeamId' });
  const tournament = doc?.tournament ?? tournamentDocument({ id: 'tournamentId' });
  const tournamentId = tournament.id;
  const homeTeamId = homeTeam.id;
  const awayTeamId = awayTeam.id;
  const id = doc?.id ?? 'matchId';
  return {
    awayTeamId,
    homeTeamId,
    tournamentId,
    homeTeam,
    awayTeam,
    tournament,
    id,
    group: 'Group',
    startTime: 'startTime',
    'documentType-id': `match#${id}`,
    'tournamentId-documentType': `${tournamentId}#match`,
    'homeTeamId-documentType': `${homeTeamId}#match`,
    'awayTeamId-documentType': `${awayTeamId}#match`,
    documentType: 'match',
    orderingValue: 'startTime',
    expiresAt: undefined,
    ...doc
  };
};

export const matchResponse = (res?: Partial<Pick<MatchResponse, keyof MatchRequest | 'matchId' | 'finalScore'>>): MatchResponse => {
  const tournamentId = res?.tournamentId ?? 'tournamentId';
  const homeTeamId = res?.homeTeamId ?? 'homeTeamId';
  const awayTeamId = res?.awayTeamId ?? 'awayTeamId';
  return {
    matchId: 'matchId',
    group: 'Group',
    startTime: 'startTime',
    finalScore: undefined,
    awayTeamId: undefined,
    homeTeamId: undefined,
    tournamentId: undefined,
    'documentType-id': undefined,
    documentType: undefined,
    orderingValue: undefined,
    homeScore: undefined,
    awayScore: undefined,
    id: undefined,
    'tournamentId-documentType': undefined,
    'homeTeamId-documentType': undefined,
    'awayTeamId-documentType': undefined,
    homeTeam: teamResponse({ teamId: homeTeamId }),
    awayTeam: teamResponse({ teamId: awayTeamId }),
    tournament: tournamentResponse({ tournamentId }),
    expiresAt: undefined,
    ...res
  };
};

export const betRequest = (req?: Partial<BetRequest>): BetRequest => ({
  homeScore: 0,
  awayScore: 0,
  ...req
});

export const betDocument = (doc?: Partial<Pick<BetDocument, keyof BetRequest | 'matchId' | 'tournamentId' | 'userId' | 'userName' | 'homeScore' | 'awayScore' | 'result' | 'expiresAt'>>): BetDocument => {
  const matchId = doc?.matchId ?? 'matchId';
  const tournamentId = doc?.tournamentId ?? 'tournamentId';
  const userId = doc?.userId ?? 'userId';
  return {
    userId,
    matchId,
    tournamentId,
    homeScore: 0,
    awayScore: 0,
    userName: 'userName',
    'matchId-documentType': `${matchId}#bet`,
    'tournamentId-userId-documentType': `${tournamentId}#${userId}#bet`,
    id: `${userId}#${matchId}`,
    'documentType-id': `bet#${userId}#${matchId}`,
    documentType: 'bet',
    orderingValue: 'userName',
    expiresAt: undefined,
    ...doc
  };
};

export const betResponse = (res?: Partial<Pick<BetResponse, keyof BetRequest | 'userId' | 'point' | 'homeScore' | 'awayScore' | 'userName'>>): BetResponse => {
  const userId = res?.userId ?? 'userId';
  return {
    userId,
    userName: 'userName',
    homeScore: 0,
    awayScore: 0,
    result: undefined,
    tournamentId: undefined,
    'matchId-documentType': undefined,
    'tournamentId-userId-documentType': undefined,
    point: 0,
    matchId: undefined,
    id: undefined,
    documentType: undefined,
    orderingValue: undefined,
    'documentType-id': undefined,
    expiresAt: undefined,
    ...res
  };
};

const toFourDigit = (input: number) => String(input).padStart(4, '0');

export const standingDocument = (doc?: Partial<Pick<StandingDocument, 'userName' | 'tournamentId' | 'userId' | 'results' | 'total' | 'expiresAt'>>): StandingDocument => {
  const tournamentId = doc?.tournamentId ?? 'tournamentId';
  const userId = doc?.userId ?? 'userId';
  const total = doc?.total ?? 0;
  const results = doc?.results ?? {
    exactMatch: 0,
    goalDifference: 0,
    nothing: 0,
    outcome: 0
  };
  const orderingValue = `${toFourDigit(total)}#${toFourDigit(results.exactMatch)}#${toFourDigit(results.goalDifference)}#${toFourDigit(results.outcome)}`;
  return {
    tournamentId,
    userId,
    total,
    results,
    orderingValue,
    userName: 'userName',
    'tournamentId-documentType': `${tournamentId}#standing`,
    id: `${tournamentId}#${userId}`,
    'documentType-id': `standing#${tournamentId}#${userId}`,
    documentType: 'standing',
    expiresAt: undefined,
    ...doc
  };
};

export const standingResponse = (res?: Partial<Pick<StandingResponse, 'userId' | 'total' | 'results'>>): StandingResponse => {
  const userId = res?.userId ?? 'userId';
  const total = res?.total ?? 0;
  const results = res?.results ?? {
    exactMatch: 0,
    goalDifference: 0,
    nothing: 0,
    outcome: 0
  };
  return {
    userId,
    total,
    results,
    userName: 'userName',
    'documentType-id': undefined,
    'tournamentId-documentType': undefined,
    documentType: undefined,
    id: undefined,
    orderingValue: undefined,
    tournamentId: undefined,
    expiresAt: undefined,
    ...res
  };
};

export const compareResponse = (res?: RecursivePartial<CompareResponse>): CompareResponse => {
  const leftUserName = res?.leftUserName ?? 'leftUserName';
  const rightUserName = res?.rightUserName ?? 'rightUserName';
  const matches = res?.matches ?? [] as any;
  return {
    leftUserName,
    rightUserName,
    matches,
    ...res
  };
};
