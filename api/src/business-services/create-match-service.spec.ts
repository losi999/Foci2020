import { createMatchServiceFactory, ICreateMatchService } from '@/business-services/create-match-service';
import { IDatabaseService } from '@/services/database-service';
import { MatchRequest, TeamDocument, TournamentDocument } from '@/types';
describe('Create match service', () => {
  let mockDatabaseService: IDatabaseService;
  let mockSaveMatch: jest.Mock;
  let mockQueryTeamById: jest.Mock;
  let mockQueryTournamentById: jest.Mock;
  let mockUuid: jest.Mock;
  let service: ICreateMatchService;

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
  });

  it('should return undefined if match is saved', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const matchId = 'matchId';
    const partitionKey = 'match-matchId';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
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
        partitionKey,
        sortKey: 'details',
        documentType: 'match',
        group: body.group,
        startTime: body.startTime,
      },
      {
        matchId,
        partitionKey,
        sortKey: 'homeTeam',
        documentType: 'match',
        ...homeTeam
      },
      {
        matchId,
        partitionKey,
        sortKey: 'awayTeam',
        documentType: 'match',
        ...awayTeam
      }, {
        matchId,
        partitionKey,
        sortKey: 'tournament',
        documentType: 'match',
        ...tournament
      }
    ]);
  });

  it('should throw error if unable to query home team', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
    };

    mockQueryTeamById.mockRejectedValue('This is a dynamo error');
    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query home team');
    }
  });

  it('should throw error if unable to query away team', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
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
      expect(error.message).toEqual('Unable to query away team');
    }
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
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
      expect(error.message).toEqual('Unable to query tournament');
    }
  });

  it('should throw error if unable to save match', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const matchId = 'matchId';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
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
      expect(error.message).toEqual('Error while saving team');
    }
  });

  it('should throw error if no home team found', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
    };

    mockQueryTeamById.mockResolvedValueOnce(undefined);

    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual('No team found');
    }
  });

  it('should throw error if no away team found', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
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
      expect(error.message).toEqual('No team found');
    }
  });

  it('should throw error if no tournament found', async () => {
    const tournamentId = 'tournamentId';
    const awayTeamId = 'awayTeamId';
    const homeTeamId = 'homeTeamId';
    const group = 'group';
    const startTime = 'startTime';
    const body: MatchRequest = {
      tournamentId,
      homeTeamId,
      awayTeamId,
      group,
      startTime
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
      expect(error.message).toEqual('No tournament found');
    }
  });
});
