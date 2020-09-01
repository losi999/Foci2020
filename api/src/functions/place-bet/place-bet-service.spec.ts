import { IPlaceBetService, placeBetServiceFactory } from '@foci2020/api/functions/place-bet/place-bet-service';
import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { betRequest, matchDocument, betDocument } from '@foci2020/shared/common/test-data-factory';
import { MatchIdType, UserIdType } from '@foci2020/shared/types/common';

describe('Place bet service', () => {
  let service: IPlaceBetService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;

  const now = new Date(2020, 2, 11, 21, 6, 0);
  const expiresIn = 30;

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
  const userId = 'userId' as UserIdType;
  const matchId = 'matchId' as MatchIdType;
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
      userName,
      expiresIn
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    validateFunctionCall(mockBetDocumentConverter.functions.create, bet, userId, userName, matchId, queriedMatch.tournamentId, expiresIn);
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
        userName,
        expiresIn
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
        userName,
        expiresIn
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
        userName,
        expiresIn
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
        userName,
        expiresIn
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
        userName,
        expiresIn
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
        userName,
        expiresIn
      }).catch(validateError('Unable to save bet', 500));
      validateFunctionCall(mockDatabaseService.functions.getBetById, userId, matchId);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.create, bet, userId, userName, matchId, queriedMatch.tournamentId, expiresIn);
      validateFunctionCall(mockDatabaseService.functions.saveBet, converted);
      expect.assertions(6);
    });
  });
});
