import { createMatchServiceFactory, ICreateMatchService } from '@/business-services/create-match-service';
import { IDatabaseService } from '@/services/database-service';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@/common';
import { MatchRequest } from '@/types/requests';
import { TeamDocument, TournamentDocument } from '@/types/documents';

describe('Create match service', () => {
  let mockDatabaseService: IDatabaseService;
  let mockSaveMatch: jest.Mock;
  let mockQueryTeamById: jest.Mock;
  let mockQueryTournamentById: jest.Mock;
  let mockUuid: jest.Mock;
  let service: ICreateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);

  beforeEach(() => {
    mockSaveMatch = jest.fn();
    mockQueryTeamById = jest.fn();
    mockQueryTournamentById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      saveMatch: mockSaveMatch,
      queryTeamById: mockQueryTeamById,
      queryTournamentById: mockQueryTournamentById,
    })))() as IDatabaseService;

    mockUuid = jest.fn();

    service = createMatchServiceFactory(mockDatabaseService, mockUuid);
    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });

  it('should return undefined if match is saved', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = addMinutes(5.1, now);
    const matchId = 'matchId';
    const partitionKey = 'match-matchId';
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
    mockUuid.mockReturnValue(matchId);
    mockSaveMatch.mockResolvedValue(undefined);

    const result = await service({ body });
    expect(result).toBeUndefined();
    expect(mockSaveMatch).toHaveBeenCalledWith([
      {
        matchId,
        'documentType-id': partitionKey,
        segment: 'details',
        documentType: 'match',
        group: body.group,
        startTime: body.startTime,
        orderingValue: `${tournamentId}-${body.startTime}`
      },
      {
        matchId,
        'documentType-id': partitionKey,
        segment: 'homeTeam',
        documentType: 'match',
        orderingValue: `${tournamentId}-${body.startTime}`,
        ...homeTeam
      },
      {
        matchId,
        'documentType-id': partitionKey,
        segment: 'awayTeam',
        documentType: 'match',
        orderingValue: `${tournamentId}-${body.startTime}`,
        ...awayTeam
      }, {
        matchId,
        'documentType-id': partitionKey,
        segment: 'tournament',
        documentType: 'match',
        orderingValue: `${tournamentId}-${body.startTime}`,
        ...tournament
      }
    ]);
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
      await service({ body });
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
      await service({ body });
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
      await service({ body });
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
      await service({ body });
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
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query related document');
    }
  });

  it('should throw error if unable to save match', async () => {
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
    mockUuid.mockReturnValue(matchId);
    mockSaveMatch.mockRejectedValue('This is a dynamo error');

    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while saving match');
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
      await service({ body });
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
      await service({ body });
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
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('Tournament not found');
    }
  });
});
