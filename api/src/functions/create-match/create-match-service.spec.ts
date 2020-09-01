import { createMatchServiceFactory, ICreateMatchService } from '@foci2020/api/functions/create-match/create-match-service';
import { advanceTo, clear } from 'jest-date-mock';
import { Mock, createMockService, validateFunctionCall, validateError } from '@foci2020/shared/common/unit-testing';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { addMinutes } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { teamDocument, tournamentDocument, matchRequest, matchDocument } from '@foci2020/shared/common/test-data-factory';
import { TeamIdType } from '@foci2020/shared/types/common';

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

  afterEach(() => {
    clear();
  });

  const expiresIn = 30;

  it('should return with matchId if match is saved', async () => {
    const body = matchRequest({
      startTime: addMinutes(5.1).toISOString()
    });

    const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType });
    const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType });
    const queriedTournament = tournamentDocument();
    const convertedMatch = matchDocument();

    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
    mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
    mockMatchDocumentConverter.functions.create.mockReturnValue(convertedMatch);
    mockDatabaseService.functions.saveMatch.mockResolvedValue(undefined);

    const result = await service({ body, expiresIn });
    expect(result).toEqual(convertedMatch.id);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
    validateFunctionCall(mockMatchDocumentConverter.functions.create, body, queriedHomeTeam, queriedAwayTeam, queriedTournament, expiresIn);
    validateFunctionCall(mockDatabaseService.functions.saveMatch, convertedMatch);
  });

  describe('should throw error', () => {
    it('if startTime is less than 5 minutes from now', async () => {
      const body = matchRequest({
        startTime: addMinutes(4.9).toISOString()
      });

      await service({ body, expiresIn }).catch(validateError('Start time has to be at least 5 minutes from now', 400));

      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if home and away teams are the same', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
        homeTeamId: 'sameTeamId' as TeamIdType,
        awayTeamId: 'sameTeamId' as TeamIdType
      });

      await service({ body, expiresIn }).catch(validateError('Home and away teams cannot be the same', 400));

      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTeamById);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if unable to query home team', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });

      mockDatabaseService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

      await service({ body, expiresIn }).catch(validateError('Unable to query related document', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if unable to query away team', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockRejectedValueOnce('This is a dynamo error');

      await service({ body, expiresIn }).catch(validateError('Unable to query related document', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if unable to query tournament', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockRejectedValueOnce('This is a dynamo error');

      await service({ body, expiresIn }).catch(validateError('Unable to query related document', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if unable to save match', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType });
      const queriedTournament = tournamentDocument();
      const convertedMatch = matchDocument();

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(queriedTournament);
      mockMatchDocumentConverter.functions.create.mockReturnValue(convertedMatch);
      mockDatabaseService.functions.saveMatch.mockRejectedValue('This is a dynamo error');

      await service({ body, expiresIn }).catch(validateError('Error while saving match', 500));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create, body, queriedHomeTeam, queriedAwayTeam, queriedTournament, expiresIn);
      validateFunctionCall(mockDatabaseService.functions.saveMatch, convertedMatch);
      expect.assertions(7);
    });

    it('if no home team found', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

      await service({ body, expiresIn }).catch(validateError('Home team not found', 400));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if no away team found', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(undefined);

      await service({ body, expiresIn }).catch(validateError('Away team not found', 400));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });

    it('if no tournament found', async () => {
      const body = matchRequest({
        startTime: addMinutes(5.1).toISOString(),
      });
      const queriedHomeTeam = teamDocument({ id: 'homeTeamId' as TeamIdType });
      const queriedAwayTeam = teamDocument({ id: 'awayTeamId' as TeamIdType });

      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedHomeTeam);
      mockDatabaseService.functions.getTeamById.mockResolvedValueOnce(queriedAwayTeam);
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

      await service({ body, expiresIn }).catch(validateError('Tournament not found', 400));

      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(1, body.homeTeamId);
      expect(mockDatabaseService.functions.getTeamById).toHaveBeenNthCalledWith(2, body.awayTeamId);
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockMatchDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveMatch);
      expect.assertions(7);
    });
  });
});
