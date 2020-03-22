import { updateMatchServiceFactory, IUpdateMatchService } from '@/functions/update-match/update-match-service';
import { advanceTo, clear } from 'jest-date-mock';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { IMatchDocumentService } from '@/services/match-document-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument, MatchRequest } from '@/types/types';
import { addMinutes } from '@/common';

describe('Update match service', () => {
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let service: IUpdateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);
  const matchId = 'matchId';

  beforeEach(() => {
    mockMatchDocumentConverter = createMockService('update');
    mockMatchDocumentService = createMockService('updateMatch');
    mockTeamDocumentService = createMockService('getTeamById');
    mockTournamentDocumentService = createMockService('getTournamentById');

    service = updateMatchServiceFactory(mockMatchDocumentService.service, mockMatchDocumentConverter.service, mockTeamDocumentService.service, mockTournamentDocumentService.service);
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

  it('should return undefined if match is updated', async () => {
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

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTournamentDocumentService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.update.mockReturnValue(convertedMatch);
    mockMatchDocumentService.functions.updateMatch.mockResolvedValue(undefined);

    const result = await service({
      body,
      matchId
    });

    expect(result).toBeUndefined();
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).toHaveBeenCalledWith(matchId, body, queriedAwayTeam, queriedHomeTeam, queriedTournament);
    expect(mockMatchDocumentService.functions.updateMatch).toHaveBeenCalledWith(convertedMatch);
  });

  it('should throw error if startTime is less than 5 minutes from now', async () => {
    const {
      matchId,
      body,
    } = setup(({ minutesFromNow: 4.9 }));

    await service({
      body,
      matchId
    }).catch(validateError('Start time has to be at least 5 minutes from now', 400));

    expect(mockTeamDocumentService.functions.getTeamById).not.toHaveBeenCalled();
    expect(mockTournamentDocumentService.functions.getTournamentById).not.toHaveBeenCalled();
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if home and away teams are the same', async () => {
    const {
      body,
    } = setup({
      homeTeamId: 'sameTeamId',
      awayTeamId: 'sameTeamId'
    });

    await service({
      body,
      matchId
    }).catch(validateError('Home and away teams cannot be the same', 400));

    expect(mockTeamDocumentService.functions.getTeamById).not.toHaveBeenCalled();
    expect(mockTournamentDocumentService.functions.getTournamentById).not.toHaveBeenCalled();
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to query home team', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      body,
    } = setup();

    mockTeamDocumentService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

    await service({
      body,
      matchId
    }).catch(validateError('Unable to query related document', 500));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to query away team', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedHomeTeam,
      body,
    } = setup();

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.getTeamById.mockRejectedValueOnce('This is a dynamo error');

    await service({
      body,
      matchId
    }).catch(validateError('Unable to query related document', 500));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to query tournament', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedAwayTeam,
      queriedHomeTeam,
      body,
    } = setup();

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.getTournamentById.mockRejectedValueOnce('This is a dynamo error');

    await service({
      body,
      matchId
    }).catch(validateError('Unable to query related document', 500));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if unable to update match', async () => {
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

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.update.mockReturnValue(convertedMatch);
    mockMatchDocumentService.functions.updateMatch.mockRejectedValue('This is a dynamo error');

    await service({
      body,
      matchId
    }).catch(validateError('Error while updating match', 500));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).toHaveBeenCalledWith(matchId, body, queriedHomeTeam, queriedAwayTeam, queriedTournament);
    expect(mockMatchDocumentService.functions.updateMatch).toHaveBeenCalledWith(convertedMatch);
    expect.assertions(7);
  });

  it('should throw error if no home team found', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      body,
    } = setup();

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(undefined);

    await service({
      body,
      matchId
    }).catch(validateError('Home team not found', 400));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if no away team found', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedHomeTeam,
      body,
    } = setup();

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(undefined);

    await service({
      body,
      matchId
    }).catch(validateError('Away team not found', 400));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should throw error if no tournament found', async () => {
    const {
      matchId,
      awayTeamId,
      homeTeamId,
      tournamentId,
      queriedAwayTeam,
      queriedHomeTeam,
      body,
    } = setup();

    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockTeamDocumentService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockTournamentDocumentService.functions.getTournamentById.mockResolvedValue(undefined);

    await service({
      body,
      matchId
    }).catch(validateError('Tournament not found', 400));

    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(1, homeTeamId);
    expect(mockTeamDocumentService.functions.getTeamById).toHaveBeenNthCalledWith(2, awayTeamId);
    expect(mockTournamentDocumentService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.update).not.toHaveBeenCalled();
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(7);
  });
});
