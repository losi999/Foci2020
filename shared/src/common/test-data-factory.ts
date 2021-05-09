import { TeamRequest, TournamentRequest, MatchRequest, BetRequest } from '@foci2020/shared/types/requests';
import { TeamDocument, TournamentDocument, MatchDocument, BetDocument, StandingDocument } from '@foci2020/shared/types/documents';
import { TeamResponse, TournamentResponse, MatchResponse, BetResponse, StandingResponse, CompareResponse } from '@foci2020/shared/types/responses';
import { RecursivePartial, TeamIdType, TournamentIdType, MatchIdType, UserIdType, KeyType } from '@foci2020/shared/types/common';

export const teamRequest = (req?: Partial<TeamRequest>): TeamRequest => ({
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  ...req,
});

export const teamDocument = (doc?: Partial<Pick<TeamDocument, keyof TeamRequest | 'id' | 'expiresAt' | 'modifiedAt'>>): TeamDocument => {
  const id = doc?.id ?? 'teamId' as TeamIdType;
  return {
    id,
    image: 'http://image.com',
    shortName: 'TMN',
    teamName: 'Team name',
    'documentType-id': `team#${id}` as KeyType,
    documentType: 'team',
    orderingValue: 'Team name',
    expiresAt: undefined,
    modifiedAt: 'now',
    ...doc,
  };
};

export const teamResponse = (res?: Partial<Pick<TeamResponse, keyof TeamRequest | 'teamId'>>): TeamResponse => ({
  teamId: 'teamId' as TeamIdType,
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined,
  expiresAt: undefined,
  modifiedAt: undefined,
  ...res,
});

export const tournamentRequest = (req?: Partial<TournamentRequest>): TournamentRequest => ({
  tournamentName: 'Tournament',
  ...req,
});

export const tournamentDocument = (doc?: Partial<Pick<TournamentDocument, keyof TournamentRequest | 'id' | 'expiresAt' | 'modifiedAt'>>): TournamentDocument => {
  const id = doc?.id ?? 'tournamentId' as TournamentIdType;
  return {
    id,
    tournamentName: 'Tournament',
    'documentType-id': `tournament#${id}` as KeyType,
    documentType: 'tournament',
    orderingValue: 'Tournament',
    expiresAt: undefined,
    modifiedAt: 'now',
    ...doc,
  };
};

export const tournamentResponse = (res?: Partial<Pick<TournamentResponse, keyof TournamentRequest | 'tournamentId'>>): TournamentResponse => ({
  tournamentId: 'tournamentId' as TournamentIdType,
  tournamentName: 'Tournament',
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined,
  expiresAt: undefined,
  modifiedAt: undefined,
  ...res,
});

export const matchRequest = (req?: Partial<MatchRequest>): MatchRequest => ({
  awayTeamId: 'awayTeamId' as TeamIdType,
  homeTeamId: 'homeTeamId' as TeamIdType,
  tournamentId: 'tournamentId' as TournamentIdType,
  group: 'Group',
  startTime: 'startTime',
  ...req,
});

export const matchDocument = (doc?: Partial<Pick<MatchDocument, 'startTime' | 'group' | 'id' | 'finalScore' | 'homeTeam' | 'awayTeam' | 'tournament' | 'expiresAt' | 'modifiedAt'>>): MatchDocument => {
  const homeTeam = doc?.homeTeam ?? teamDocument({
    id: 'homeTeamId' as TeamIdType, 
  });
  const awayTeam = doc?.awayTeam ?? teamDocument({
    id: 'awayTeamId' as TeamIdType, 
  });
  const tournament = doc?.tournament ?? tournamentDocument({
    id: 'tournamentId' as TournamentIdType, 
  });
  const tournamentId = tournament.id;
  const homeTeamId = homeTeam.id;
  const awayTeamId = awayTeam.id;
  const id = doc?.id ?? 'matchId' as MatchIdType;
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
    'documentType-id': `match#${id}` as KeyType,
    'tournamentId-documentType': `${tournamentId}#match`,
    'homeTeamId-documentType': `${homeTeamId}#match`,
    'awayTeamId-documentType': `${awayTeamId}#match`,
    documentType: 'match',
    orderingValue: 'startTime',
    expiresAt: undefined,
    modifiedAt: 'now',
    ...doc,
  };
};

export const matchResponse = (res?: Partial<Pick<MatchResponse, keyof MatchRequest | 'matchId' | 'finalScore'>>): MatchResponse => {
  const tournamentId = res?.tournamentId ?? 'tournamentId' as TournamentIdType;
  const homeTeamId = res?.homeTeamId ?? 'homeTeamId' as TeamIdType;
  const awayTeamId = res?.awayTeamId ?? 'awayTeamId' as TeamIdType;
  return {
    matchId: 'matchId' as MatchIdType,
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
    homeTeam: teamResponse({
      teamId: homeTeamId, 
    }),
    awayTeam: teamResponse({
      teamId: awayTeamId, 
    }),
    tournament: tournamentResponse({
      tournamentId, 
    }),
    expiresAt: undefined,
    modifiedAt: undefined,
    ...res,
  };
};

export const betRequest = (req?: Partial<BetRequest>): BetRequest => ({
  homeScore: 0,
  awayScore: 0,
  ...req,
});

export const betDocument = (doc?: Partial<Pick<BetDocument, keyof BetRequest | 'matchId' | 'tournamentId' | 'userId' | 'userName' | 'homeScore' | 'awayScore' | 'result' | 'expiresAt' | 'modifiedAt'>>): BetDocument => {
  const matchId = doc?.matchId ?? 'matchId' as MatchIdType;
  const tournamentId = doc?.tournamentId ?? 'tournamentId' as TournamentIdType;
  const userId = doc?.userId ?? 'userId' as UserIdType;
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
    'documentType-id': `bet#${userId}#${matchId}` as KeyType,
    documentType: 'bet',
    orderingValue: 'userName',
    expiresAt: undefined,
    result: undefined,
    modifiedAt: 'now',
    ...doc,
  };
};

export const betResponse = (res?: Partial<Pick<BetResponse, keyof BetRequest | 'userId' | 'point' | 'homeScore' | 'awayScore' | 'userName' | 'result'>>): BetResponse => {
  const userId = res?.userId ?? 'userId' as UserIdType;
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
    modifiedAt: undefined,
    ...res,
  };
};

const toFourDigit = (input: number) => String(input).padStart(4, '0');

export const standingDocument = (doc?: Partial<Pick<StandingDocument, 'userName' | 'tournamentId' | 'userId' | 'results' | 'total' | 'expiresAt' | 'modifiedAt'>>): StandingDocument => {
  const tournamentId = doc?.tournamentId ?? 'tournamentId' as TournamentIdType;
  const userId = doc?.userId ?? 'userId' as UserIdType;
  const total = doc?.total ?? 0;
  const results = doc?.results ?? {
    exactMatch: 0,
    goalDifference: 0,
    nothing: 0,
    outcome: 0,
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
    'documentType-id': `standing#${tournamentId}#${userId}` as KeyType,
    documentType: 'standing',
    expiresAt: undefined,
    modifiedAt: 'now',
    ...doc,
  };
};

export const standingResponse = (res?: Partial<Pick<StandingResponse, 'userId' | 'total' | 'results'>>): StandingResponse => {
  const userId = res?.userId ?? 'userId' as UserIdType;
  const total = res?.total ?? 0;
  const results = res?.results ?? {
    exactMatch: 0,
    goalDifference: 0,
    nothing: 0,
    outcome: 0,
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
    modifiedAt: undefined,
    ...res,
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
    ...res,
  };
};
