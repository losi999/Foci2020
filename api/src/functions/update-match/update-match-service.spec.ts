import { updateMatchServiceFactory, IUpdateMatchService } from '@foci2020/api/functions/update-match/update-match-service';
import { advanceTo, clear } from 'jest-date-mock';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { addMinutes } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { teamDocument, tournamentDocument, matchDocument, matchRequest } from '@foci2020/shared/common/test-data-factory';
import { MatchIdType, TeamIdType } from '@foci2020/shared/types/common';

describe('Update match service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;
  let service: IUpdateMatchService;

  const now = new Date(2019, 3, 21, 19, 0, 0);
  const matchId = 'matchId' as MatchIdType;
  const expiresIn = 30;

  beforeEach(() => {
    mockMatchDocumentConverter = createMockService('update');
    mockDatabaseService = createMockService('updateMatch', 'getTeamById', 'getTournamentById', 'getMatchById');

    service = updateMatchServiceFactory(mockDatabaseService.service, mockMatchDocumentConverter.service);
    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });

  it('should return undefined if match is updated', async () => {
    const queriedMatch = matchDocument();
    const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType, });
    const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType, });
    const queriedTournament = tournamentDocument();

    const convertedMatch = matchDocument();

    const body = matchRequest({
      startTime: addMinutes(5.1).toISOString()
    });

    mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.update.mockReturnValue(convertedMatch);
    mockDatabaseService.functions.updateMatch.mockResolvedValue(undefined);

    const result = await service({
      body,
      matchId,
      expiresIn
    });

    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
    validateFunctionCall(mockMatchDocumentConverter.functions.update, matchId, body, queriedAwayTeam, queriedHomeTeam, queriedTournament, expiresIn);
    validateFunctionCall(mockDatabaseService.functions.updateMatch, convertedMatch);
    expect.assertions(7);
  });

  describe('should throw error', () => {
    it('if startTime is less than 5 minutes from now', async () => {
      const body = matchRequest({
        startTime: addMinutes(4.9).toISOString()
      });

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Start time has to be at least 5 minutes from now', 400));

      validateFunctionCall(mockDatabaseService.functions.getMatchById);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if home and away teams are the same', async () => {
      const body = matchRequest({
        homeTeamId: 'sameTeamId' as TeamIdType,
        awayTeamId: 'sameTeamId' as TeamIdType,
        startTime: addMinutes(5.1).toISOString()
      });

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Home and away teams cannot be the same', 400));

      validateFunctionCall(mockDatabaseService.functions.getMatchById);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if unable to query match', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockRejectedValue('This is a dynamo error');

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Unable to query match', 500));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if no match found', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('No match found', 404));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if final score is already set', async () => {
      const queriedMatch = matchDocument({
        finalScore: {
          homeScore: 1,
          awayScore: 2
        }
      });
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Final score is already set for this match', 400));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(7);
    });

    it('if unable to query home team', async () => {
      const queriedMatch = matchDocument();
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Unable to query related document', 500));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(8);
    });

    it('if unable to query away team', async () => {
      const queriedMatch = matchDocument();
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType, });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockRejectedValueOnce('This is a dynamo error');

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Unable to query related document', 500));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(8);
    });

    it('if unable to query tournament', async () => {
      const queriedMatch = matchDocument();
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType, });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType, });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockRejectedValueOnce('This is a dynamo error');

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Unable to query related document', 500));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(8);
    });

    it('if no home team found', async () => {
      const queriedMatch = matchDocument();
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Home team not found', 400));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(8);
    });

    it('if no away team found', async () => {
      const queriedMatch = matchDocument();
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType, });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Away team not found', 400));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(8);
    });

    it('if no tournament found', async () => {
      const queriedMatch = matchDocument();
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType, });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType, });

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Tournament not found', 400));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(8);
    });

    it('if unable to update match', async () => {
      const queriedMatch = matchDocument();
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType, });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType, });
      const queriedTournament = tournamentDocument();

      const convertedMatch = matchDocument();

      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString()
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
      mockMatchDocumentConverter.functions.update.mockReturnValue(convertedMatch);
      mockDatabaseService.functions.updateMatch.mockRejectedValue('This is a dynamo error');

      await service({
        body,
        matchId,
        expiresIn
      }).catch(validateError('Error while updating match', 500));

      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.update, matchId, body, queriedHomeTeam, queriedAwayTeam, queriedTournament, expiresIn);
      validateFunctionCall(mockDatabaseService.functions.updateMatch, convertedMatch);
      expect.assertions(8);
    });
  });
});
