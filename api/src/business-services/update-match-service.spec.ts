import { updateMatchServiceFactory, IUpdateMatchService } from '@/business-services/update-match-service';
import { IDatabaseService } from '@/services/database-service';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@/common';
import { MatchRequest } from '@/types/requests';
import { TeamDocument, TournamentDocument } from '@/types/documents';

describe('Update match service', () => {
  let mockDatabaseService: IDatabaseService;
  let mockUpdateMatch: jest.Mock;
  let mockQueryTeamById: jest.Mock;
  let mockQueryTournamentById: jest.Mock;
  let service: IUpdateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);
  const matchId = 'matchId';

  beforeEach(() => {
    mockUpdateMatch = jest.fn();
    mockQueryTeamById = jest.fn();
    mockQueryTournamentById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      updateMatch: mockUpdateMatch,
      queryTeamById: mockQueryTeamById,
      queryTournamentById: mockQueryTournamentById,
    })))() as IDatabaseService;

    service = updateMatchServiceFactory(mockDatabaseService);
    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });

  it('should return undefined if match is updated', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };
    const homeTeam = {
      teamId: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    const awayTeam = {
      teamId: awayTeamId,
      teamName: 'awayTeam',
      image: 'http://away.png',
      shortName: 'AWT'
    } as TeamDocument;

    const tournament = {
      tournamentId,
      tournamentName: 'tournament'
    } as TournamentDocument;

    mockQueryTeamById.mockResolvedValueOnce(homeTeam);
    mockQueryTeamById.mockResolvedValueOnce(awayTeam);
    mockQueryTournamentById.mockResolvedValue(tournament);
    mockUpdateMatch.mockResolvedValue(undefined);

    const result = await service({
      body,
      matchId
    });
    expect(result).toBeUndefined();
    expect(mockUpdateMatch).toHaveBeenCalledWith(matchId, body, homeTeam, awayTeam, tournament);
  });

  it('should throw error if startTime is less than 5 minutes from now', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(4.9, now);

    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('Start time has to be at least 5 minutes from now');
    }
  });

  it('should throw error if home and away teams are the same', async () => {
    const tournamentId = 'tournamentId';
    const teamId = 'teamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      group,
      homeTeamId: teamId,
      awayTeamId: teamId,
      startTime: startTime.toISOString()
    };

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('Home and away teams cannot be the same');
    }
  });

  it('should throw error if unable to query home team', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };

    mockQueryTeamById.mockRejectedValue('This is a dynamo error');
    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query related document');
    }
  });

  it('should throw error if unable to query away team', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };
    const homeTeam = {
      teamId: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    mockQueryTeamById.mockResolvedValueOnce(homeTeam);
    mockQueryTeamById.mockRejectedValueOnce('This is a dynamo error');

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query related document');
    }
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };
    const homeTeam = {
      teamId: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    const awayTeam = {
      teamId: awayTeamId,
      teamName: 'awayTeam',
      image: 'http://away.png',
      shortName: 'AWT'
    } as TeamDocument;

    mockQueryTeamById.mockResolvedValueOnce(homeTeam);
    mockQueryTeamById.mockResolvedValueOnce(awayTeam);
    mockQueryTournamentById.mockRejectedValueOnce('This is a dynamo error');

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query related document');
    }
  });

  it('should throw error if unable to update match', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const matchId = 'matchId';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };
    const homeTeam = {
      teamId: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    const awayTeam = {
      teamId: awayTeamId,
      teamName: 'awayTeam',
      image: 'http://away.png',
      shortName: 'AWT'
    } as TeamDocument;

    const tournament = {
      tournamentId,
      tournamentName: 'tournament'
    } as TournamentDocument;

    mockQueryTeamById.mockResolvedValueOnce(homeTeam);
    mockQueryTeamById.mockResolvedValueOnce(awayTeam);
    mockQueryTournamentById.mockResolvedValue(tournament);
    mockUpdateMatch.mockRejectedValue('This is a dynamo error');

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while updating match');
    }
  });

  it('should throw error if no home team found', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };

    mockQueryTeamById.mockResolvedValueOnce(undefined);

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('Home team not found');
    }
  });

  it('should throw error if no away team found', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };
    const homeTeam = {
      teamId: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    mockQueryTeamById.mockResolvedValueOnce(homeTeam);
    mockQueryTeamById.mockResolvedValueOnce(undefined);

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('Away team not found');
    }
  });

  it('should throw error if no tournament found', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime: startTime.toISOString()
    };
    const homeTeam = {
      teamId: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    const awayTeam = {
      teamId: awayTeamId,
      teamName: 'awayTeam',
      image: 'http://away.png',
      shortName: 'AWT'
    } as TeamDocument;

    mockQueryTeamById.mockResolvedValueOnce(homeTeam);
    mockQueryTeamById.mockResolvedValueOnce(awayTeam);
    mockQueryTournamentById.mockResolvedValue(undefined);

    try {
      await service({
        body,
        matchId
      });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('Tournament not found');
    }
  });
});
