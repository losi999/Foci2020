import { createMatchServiceFactory, ICreateMatchService } from '@/functions/create-match/create-match-service';
import { advanceTo, clear } from 'jest-date-mock';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument, MatchRequest } from '@/types/types';
import { addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';

describe('Create match service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;
  let service: ICreateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);

  beforeEach(() => {
    mockDatabaseService = createMockService('saveMatch', 'getTeamById', 'getTournamentById');
    mockMatchDocumentConverter = createMockService('create');

    service = createMatchServiceFactory(mockDatabaseService.service, mockMatchDocumentConverter.service);
    advanceTo(now);
  });

  type TestDataInput = {
    matchId: string,
    tournamentId: string,
    homeTeamId: string,
    awayTeamId: string,
    queriedHomeTeam: TeamDocument,
    queriedAwayTeam: TeamDocument,
    queriedTournament: TournamentDocument,
    convertedMatch: MatchDocument,
  };

  type TestData = TestDataInput & {
    body: MatchRequest,
  };

  const setup = (input?: Partial<TestDataInput> & { minutesFromNow?: number }): TestData => {
    const tournamentId = input?.tournamentId ?? 'tournamentId';
    const awayTeamId = input?.awayTeamId ?? 'awayTeamId';
    const homeTeamId = input?.homeTeamId ?? 'homeTeamId';
    const matchId = input?.matchId ?? 'matchId';
    const queriedHomeTeam = input?.queriedHomeTeam ?? {
      id: homeTeamId,
      teamName: 'homeTeam',
      image: 'http://home.png',
      shortName: 'HMT'
    } as TeamDocument;

    const queriedAwayTeam = input?.queriedAwayTeam ?? {
      id: awayTeamId,
      teamName: 'awayTeam',
      image: 'http://away.png',
      shortName: 'AWT'
    } as TeamDocument;

    const queriedTournament = input?.queriedTournament ?? {
      id: tournamentId,
      tournamentName: 'tournament'
    } as TournamentDocument;

    const convertedMatch = input?.convertedMatch ?? {
      id: matchId
    } as MatchDocument;

    const startTime = addMinutes(input?.minutesFromNow ?? 5.1, now);
    return {
      matchId,
      tournamentId,
      homeTeamId,
      awayTeamId,
      queriedHomeTeam,
      queriedAwayTeam,
      queriedTournament,
      convertedMatch,
      body: {
        tournamentId,
        homeTeamId,
        awayTeamId,
        group: 'group',
        startTime: startTime.toISOString()
      }
    };
  };

  afterEach(() => {
    clear();
  });

  it('should return with matchId if match is saved', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedAwayTeam,
      queriedHomeTeam,
      queriedTournament,
      convertedMatch,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.create.mockReturnValue(convertedMatch);
    mockDatabaseService.functions.saveMatch.mockResolvedValue(undefined);

    const result = await service({ body });
    expect(result).toEqual(matchId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).toHaveBeenCalledWith(body, queriedHomeTeam, queriedAwayTeam, queriedTournament);
    expect(mockDatabaseService.functions.saveMatch).toHaveBeenCalledWith(convertedMatch);
  });

  it('should throw error if startTime is less than 5 minutes from now', async () => {
    const {
      body,
    } = setup({ minutesFromNow: 4.9 });

    await service({ body }).catch(validateError('Start time has to be at least 5 minutes from now', 400));

    expect(mockDatabaseService.functions.getTeamById).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.getTeamById).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.getTournamentById).not.toHaveBeenCalled();
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if home and away teams are the same', async () => {
    const {
      body,
    } = setup({
      homeTeamId: 'sameTeamId',
      awayTeamId: 'sameTeamId'
    });

    await service({ body }).catch(validateError('Home and away teams cannot be the same', 400));

    expect(mockDatabaseService.functions.getTeamById).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.getTeamById).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.getTournamentById).not.toHaveBeenCalled();
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to query home team', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

    await service({ body }).catch(validateError('Unable to query related document', 500));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to query away team', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedHomeTeam,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockRejectedValueOnce('This is a dynamo error');

    await service({ body }).catch(validateError('Unable to query related document', 500));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to query tournament', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedAwayTeam,
      queriedHomeTeam,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTournamentById.mockRejectedValueOnce('This is a dynamo error');

    await service({ body }).catch(validateError('Unable to query related document', 500));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to save match', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedAwayTeam,
      queriedHomeTeam,
      queriedTournament,
      convertedMatch,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.create.mockReturnValue(convertedMatch);
    mockDatabaseService.functions.saveMatch.mockRejectedValue('This is a dynamo error');

    await service({ body }).catch(validateError('Error while saving match', 500));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).toHaveBeenCalledWith(body, queriedHomeTeam, queriedAwayTeam, queriedTournament);
    expect(mockDatabaseService.functions.saveMatch).toHaveBeenCalledWith(convertedMatch);
    expect.assertions(7);
  });

  it('should throw error if no home team found', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

    await service({ body }).catch(validateError('Home team not found', 400));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if no away team found', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedHomeTeam,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

    await service({ body }).catch(validateError('Away team not found', 400));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if no tournament found', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedAwayTeam,
      queriedHomeTeam,
      body,
    } = setup();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

    await service({ body }).catch(validateError('Tournament not found', 400));

    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });
});
