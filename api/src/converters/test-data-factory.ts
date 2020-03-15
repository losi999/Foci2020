import {
  TeamRequest,
  TeamResponse,
  TeamDocument,
  TournamentRequest,
  TournamentDocument,
  TournamentResponse,
  MatchRequest,
  MatchDocument,
  MatchResponse,
  BetRequest,
  BetDocument,
  BetResponse,
  Score,
  BetResult
} from '@/types/types';

export const teamRequest = (): TeamRequest => ({
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name'
});

export const teamDocument = (teamId: string): TeamDocument => ({
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  'documentType-id': `team#${teamId}`,
  documentType: 'team',
  id: teamId,
  orderingValue: 'Team name'
});

export const teamResponse = (teamId: string): TeamResponse => ({
  teamId,
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined
});

export const tournamentRequest = (): TournamentRequest => ({
  tournamentName: 'Tournament'
});

export const tournamentDocument = (tournamentId: string): TournamentDocument => ({
  tournamentName: 'Tournament',
  'documentType-id': `tournament#${tournamentId}`,
  documentType: 'tournament',
  id: tournamentId,
  orderingValue: 'Tournament'
});

export const tournamentResponse = (tournamentId: string): TournamentResponse => ({
  tournamentId,
  tournamentName: 'Tournament',
  'documentType-id': undefined,
  documentType: undefined,
  id: undefined,
  orderingValue: undefined
});

export const matchRequest = (homeTeamId: string, awayTeamId: string, tournamentId: string): MatchRequest => ({
  awayTeamId,
  homeTeamId,
  tournamentId,
  group: 'Group',
  startTime: 'startTime',
});

export const matchDocument = (matchId: string, homeTeamId: string, awayTeamId: string, tournamentId: string, finalScore?: Score): MatchDocument => ({
  awayTeamId,
  homeTeamId,
  tournamentId,
  finalScore,
  id: matchId,
  group: 'Group',
  startTime: 'startTime',
  'documentType-id': `match#${matchId}`,
  documentType: 'match',
  orderingValue: `${tournamentId}#startTime`,
  homeTeam: teamDocument(homeTeamId),
  awayTeam: teamDocument(awayTeamId),
  tournament: tournamentDocument(tournamentId),
});

export const matchResponse = (matchId: string, homeTeamId: string, awayTeamId: string, tournamentId: string, finalScore?: Score): MatchResponse => ({
  matchId,
  finalScore,
  group: 'Group',
  startTime: 'startTime',
  awayTeamId: undefined,
  homeTeamId: undefined,
  tournamentId: undefined,
  'documentType-id': undefined,
  documentType: undefined,
  orderingValue: undefined,
  homeScore: undefined,
  awayScore: undefined,
  id: undefined,
  homeTeam: teamResponse(homeTeamId),
  awayTeam: teamResponse(awayTeamId),
  tournament: tournamentResponse(tournamentId),
});

export const betRequest = (homeScore: number, awayScore: number): BetRequest => ({
  homeScore,
  awayScore
});

export const betDocument = (userId: string, matchId: string, tournamentId: string, userName: string, homeScore?: number, awayScore?: number, result?: BetResult): BetDocument => ({
  userName,
  userId,
  matchId,
  homeScore,
  awayScore,
  result,
  'tournamentId-userId': `${tournamentId}#${userId}`,
  id: `${userId}#${matchId}`,
  'documentType-id': `bet#${userId}#${matchId}`,
  documentType: 'bet',
  orderingValue: userName,
});

export const betResponse = (userId: string, userName: string, homeScore?: number, awayScore?: number, result?: number): BetResponse => ({
  userId,
  userName,
  homeScore,
  awayScore,
  result: undefined,
  'tournamentId-userId': undefined,
  point: result,
  matchId: undefined,
  id: undefined,
  documentType: undefined,
  orderingValue: undefined,
  'documentType-id': undefined,
});
