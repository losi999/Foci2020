import { createMatchServiceFactory, ICreateMatchService } from '@/business-services/create-match-service';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes, Mock, createMockService, validateError } from '@/common';
import { TeamDocument, TournamentDocument, MatchDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchRequest } from '@/types/requests';

describe('Create match service', () => {
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;
  let service: ICreateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);

  beforeEach(() => {
    mockMatchDocumentService = createMockService('saveMatch');
    mockTeamDocumentService = createMockService('queryTeamById');
    mockTournamentDocumentService = createMockService('queryTournamentById');
    mockMatchDocumentConverter = createMockService('create');

    service = createMatchServiceFactory(mockMatchDocumentService.service, mockTeamDocumentService.service, mockTournamentDocumentService.service, mockMatchDocumentConverter.service);
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

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.queryTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.create.mockReturnValue(convertedMatch);
    mockMatchDocumentService.functions.saveMatch.mockResolvedValue(undefined);

    const result = await service({ body });
    expect(result).toEqual(matchId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).toHaveBeenCalledWith(body, queriedHomeTeam, queriedAwayTeam, queriedTournament);
    expect(mockMatchDocumentService.functions.saveMatch).toHaveBeenCalledWith(convertedMatch);
  });

  it('should throw error if startTime is less than 5 minutes from now', async () => {
    const {
      body,
    } = setup({ minutesFromNow: 4.9 });

    await service({ body }).catch(validateError('Start time has to be at least 5 minutes from now', 400));

    expect(mockTeamDocumentService.functions.queryTeamById).not.toHaveBeenCalled();
    expect(mockTeamDocumentService.functions.queryTeamById).not.toHaveBeenCalled();
    expect(mockTournamentDocumentService.functions.queryTournamentById).not.toHaveBeenCalled();
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
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

    expect(mockTeamDocumentService.functions.queryTeamById).not.toHaveBeenCalled();
    expect(mockTeamDocumentService.functions.queryTeamById).not.toHaveBeenCalled();
    expect(mockTournamentDocumentService.functions.queryTournamentById).not.toHaveBeenCalled();
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to query home team', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      body,
    } = setup();

    mockTeamDocumentService.functions.queryTeamById.mockRejectedValue('This is a dynamo error');

    await service({ body }).catch(validateError('Unable to query related document', 500));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
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

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.queryTeamById.mockRejectedValueOnce('This is a dynamo error');

    await service({ body }).catch(validateError('Unable to query related document', 500));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
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

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.queryTournamentById.mockRejectedValueOnce('This is a dynamo error');

    await service({ body }).catch(validateError('Unable to query related document', 500));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
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

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.queryTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.create.mockReturnValue(convertedMatch);
    mockMatchDocumentService.functions.saveMatch.mockRejectedValue('This is a dynamo error');

    await service({ body }).catch(validateError('Error while saving match', 500));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).toHaveBeenCalledWith(body, queriedHomeTeam, queriedAwayTeam, queriedTournament);
    expect(mockMatchDocumentService.functions.saveMatch).toHaveBeenCalledWith(convertedMatch);
    expect.assertions(7);
  });

  it('should throw error if no home team found', async () => {
    const {
      awayTeamId,
      homeTeamId,
      tournamentId,
      body,
    } = setup();

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(undefined);

    await service({ body }).catch(validateError('Home team not found', 400));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
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

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(undefined);

    await service({ body }).catch(validateError('Away team not found', 400));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
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

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.queryTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.queryTournamentById.mockResolvedValue(undefined);

    await service({ body }).catch(validateError('Tournament not found', 400));

    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.saveMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });
});
