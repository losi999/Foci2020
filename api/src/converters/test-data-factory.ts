import { TeamRequest, TeamResponse, TeamDocument, TournamentRequest, TournamentDocument, TournamentResponse, MatchRequest, MatchDocument, MatchResponse } from '@/types/types';

export const teamRequest = (): TeamRequest => ({
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name'
});

export const teamDocument = (teamId: string): TeamDocument => ({
  image: 'http://image.com',
  shortName: 'TMN',
  teamName: 'Team name',
  'documentType-id': `team-${teamId}`,
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
  'documentType-id': `tournament-${tournamentId}`,
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

export const matchDocument = (matchId: string, homeTeamId: string, awayTeamId: string, tournamentId: string, homeScore?: number, awayScore?: number): MatchDocument => ({
  awayTeamId,
  homeTeamId,
  tournamentId,
  awayScore,
  homeScore,
  id: matchId,
  group: 'Group',
  startTime: 'startTime',
  'documentType-id': `match-${matchId}`,
  documentType: 'match',
  orderingValue: `${tournamentId}-startTime`,
  homeTeam: teamDocument(homeTeamId),
  awayTeam: teamDocument(awayTeamId),
  tournament: tournamentDocument(tournamentId),
});

export const matchResponse = (matchId: string, homeTeamId: string, awayTeamId: string, tournamentId: string, homeScore?: number, awayScore?: number): MatchResponse => ({
  matchId,
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
  finalScore: {
    homeScore,
    awayScore
  }
});
