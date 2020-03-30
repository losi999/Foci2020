import { updateMatchServiceFactory, IUpdateMatchService } from '@/functions/update-match/update-match-service';
import { advanceTo, clear } from 'jest-date-mock';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';
import { teamDocument, tournamentDocument, matchDocument, matchRequest } from '@/common/test-data-factory';

describe('Update match service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;
  let service: IUpdateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);
  const matchId = 'matchId';

  beforeEach(() => {
    mockMatchDocumentConverter = createMockService('update');
    mockDatabaseService = createMockService('updateMatch', 'getTeamById', 'getTournamentById');

    service = updateMatchServiceFactory(mockDatabaseService.service, mockMatchDocumentConverter.service);
    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });

  it('should return undefined if match is updated', async () => {
    const queriedHomeTeam = teamDocument({ id: 'homeTeamId', });
    const queriedAwayTeam = teamDocument({ id: 'awayTeamId', });
    const queriedTournament = tournamentDocument();

    const convertedMatch = matchDocument();

    const body = matchRequest({
      startTime: addMinutes(5.1).toISOString()
    });

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.update.mockReturnValue(convertedMatch);
    mockDatabaseService.functions.updateMatch.mockResolvedValue(undefined);

    const result = await service({
      body,
      matchId
    });

    expect(result).toBeUndefined();
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
    validateFunctionCall(mockMatchDocumentConverter.functions.update, matchId, body, queriedAwayTeam, queriedHomeTeam, queriedTournament);
    validateFunctionCall(mockDatabaseService.functions.updateMatch, convertedMatch);
  });

  describe('should throw error', () => {
    it('if startTime is less than 5 minutes from now', async () => {
      const body = matchRequest({
        startTime: addMinutes(4.9).toISOString()
      });

      await service({
        body,
        matchId
      }).catch(validateError('Start time has to be at least 5 minutes from now', 400));

      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(6);
    });

    it('if home and away teams are the same', async () => {
      const body = matchRequest({
        homeTeamId: 'sameTeamId',
        awayTeamId: 'sameTeamId',
        startTime: addMinutes(5.1).toISOString()
      });

      await service({
        body,
        matchId
      }).catch(validateError('Home and away teams cannot be the same', 400));

      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(6);
    });

    it('if unable to query home team', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

      await service({
        body,
        matchId
      }).catch(validateError('Unable to query related document', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if unable to query away team', async () => {
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId', });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockRejectedValueOnce('This is a dynamo error');

      await service({
        body,
        matchId
      }).catch(validateError('Unable to query related document', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if unable to query tournament', async () => {
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId', });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId', });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockRejectedValueOnce('This is a dynamo error');

      await service({
        body,
        matchId
      }).catch(validateError('Unable to query related document', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if unable to update match', async () => {
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId', });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId', });
      const queriedTournament = tournamentDocument();

      const convertedMatch = matchDocument();

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
      mockMatchDocumentConverter.functions.update.mockReturnValue(convertedMatch);
      mockDatabaseService.functions.updateMatch.mockRejectedValue('This is a dynamo error');

      await service({
        body,
        matchId
      }).catch(validateError('Error while updating match', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update, matchId, body, queriedHomeTeam, queriedAwayTeam, queriedTournament);
      validateFunctionCall(mockDatabaseService.functions.updateMatch, convertedMatch);
      expect.assertions(7);
    });

    it('if no home team found', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

      await service({
        body,
        matchId
      }).catch(validateError('Home team not found', 400));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if no away team found', async () => {
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId', });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

      await service({
        body,
        matchId
      }).catch(validateError('Away team not found', 400));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if no tournament found', async () => {
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId', });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId', });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

      await service({
        body,
        matchId
      }).catch(validateError('Tournament not found', 400));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });
  });
});
