import { IPlaceBetService, placeBetServiceFactory } from '@/functions/place-bet/place-bet-service';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';
import { betRequest, matchDocument, betDocument } from '@/common/test-data-factory';

describe('Place bet service', () => {
  let service: IPlaceBetService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;

  const now = new Date(2020, 2, 11, 21, 6, 0);
  beforeEach(() => {
    mockBetDocumentConverter = createMockService('create');
    mockDatabaseService = createMockService('getBetById', 'saveBet', 'getMatchById');

    service = placeBetServiceFactory(mockDatabaseService.service, mockBetDocumentConverter.service);

    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });

  const bet = betRequest({
    homeScore: 1,
    awayScore: 3
  });
  const userId = 'userId';
  const matchId = 'matchId';
  const userName = 'userName';

  it('should return undefined if bet is placed on a match', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);

    const queriedMatch = matchDocument({
      startTime: addMinutes(6, now).toISOString(),
    });
    mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

    const converted = betDocument({
      homeScore: 1,
      awayScore: 3
    });
    mockBetDocumentConverter.functions.create.mockReturnValue(converted);
    mockDatabaseService.functions.saveBet.mockResolvedValue(undefined);

    const result = await service({
      bet,
      matchId,
      userId,
      userName
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    validateFunctionCall(mockBetDocumentConverter.functions.create, bet, userId, userName, matchId, queriedMatch.tournamentId);
    validateFunctionCall(mockDatabaseService.functions.saveBet, converted);
    expect.assertions(5);
  });

  describe('should throw error', () => {
    it('if bet is already placed on a match', async () => {
      mockDatabaseService.functions.getBetById.mockResolvedValue(betDocument());

      await service({
        bet,
        matchId,
        userId,
        userName
      }).catch(validateError('You already placed a bet on this match', 400));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById);
      validateFunctionCall(mockBetDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveBet);
      expect.assertions(6);
    });

    it('if unable to query bet', async () => {
      mockDatabaseService.functions.getBetById.mockRejectedValue(undefined);

      await service({
        bet,
        matchId,
        userId,
        userName
      }).catch(validateError('Unable to query bet', 500));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById);
      validateFunctionCall(mockBetDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveBet);
      expect.assertions(6);
    });

    it('if unable to query match', async () => {
      mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
      mockDatabaseService.functions.getMatchById.mockRejectedValue(undefined);

      await service({
        bet,
        matchId,
        userId,
        userName
      }).catch(validateError('Unable to query match by id', 500));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveBet);
      expect.assertions(6);
    });

    it('if no match found', async () => {
      mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
      mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

      await service({
        bet,
        matchId,
        userId,
        userName
      }).catch(validateError('No match found', 404));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveBet);
      expect.assertions(6);
    });

    it('if betting time is expired', async () => {
      mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);

      const queriedMatch = matchDocument({
        startTime: addMinutes(4, now).toISOString(),
      });
      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

      await service({
        bet,
        matchId,
        userId,
        userName
      }).catch(validateError('Betting time expired', 400));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveBet);
      expect.assertions(6);
    });

    it('if unable to save bet', async () => {
      mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);

      const queriedMatch = matchDocument({
        startTime: addMinutes(6, now).toISOString(),
      });

      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

      const converted = betDocument({
        homeScore: 1,
        awayScore: 3
      });
      mockBetDocumentConverter.functions.create.mockReturnValue(converted);
      mockDatabaseService.functions.saveBet.mockRejectedValue(undefined);

      await service({
        bet,
        matchId,
        userId,
        userName
      }).catch(validateError('Unable to save bet', 500));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.create, bet, userId, userName, matchId, queriedMatch.tournamentId);
      validateFunctionCall(mockDatabaseService.functions.saveBet, converted);
      expect.assertions(6);
    });
  });
});
