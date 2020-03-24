import { IListBetsOfMatchService, listBetsOfMatchServiceFactory } from '@/functions/list-bets-of-match/list-bets-of-match-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { advanceTo, clear } from 'jest-date-mock';
import { MatchDocument, BetDocument, BetResponse } from '@/types/types';
import { addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';

describe('List bets of match service', () => {
  let service: IListBetsOfMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;
  const now = new Date(2020, 2, 11, 23, 55, 0);
  const matchId = 'matchId';
  const userId = 'userId';
  const userId2 = 'userId2';

  beforeEach(() => {
    mockDatabaseService = createMockService('queryBetsByMatchId', 'getMatchById');
    mockBetDocumentConverter = createMockService('toResponseList');

    advanceTo(now);

    service = listBetsOfMatchServiceFactory(mockDatabaseService.service, mockBetDocumentConverter.service);
  });

  afterEach(() => {
    clear();
  });

  describe('should return a list of bets', () => {
    it('with scores hidden', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue({
        startTime: addMinutes(6, now).toISOString()
      } as MatchDocument);
      const queriedBets = [{
        userId: userId2
      }] as BetDocument[];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
      const convertedResponse = [{ userId: userId2 }] as BetResponse[];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      const result = await service({
        matchId,
        userId
      });
      expect(result).toEqual(convertedResponse);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList, queriedBets, userId);
      expect.assertions(4);
    });

    it('with scores visible because betting time is expired', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue({
        startTime: addMinutes(4, now).toISOString()
      } as MatchDocument);
      const queriedBets = [{
        userId: userId2
      }] as BetDocument[];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
      const convertedResponse = [{ userId: userId2 }] as BetResponse[];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      const result = await service({
        matchId,
        userId
      });
      expect(result).toEqual(convertedResponse);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList, queriedBets, undefined);
      expect.assertions(4);
    });

    it('with scores visible because player has placed a bet', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue({
        startTime: addMinutes(6, now).toISOString()
      } as MatchDocument);
      const queriedBets = [
        {
          userId: userId2
        }, {
          userId
        }
      ] as BetDocument[];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
      const convertedResponse = [
        {
          userId: userId2
        },
        {
          userId
        }
      ] as BetResponse[];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      const result = await service({
        matchId,
        userId
      });
      expect(result).toEqual(convertedResponse);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList, queriedBets, undefined);
      expect.assertions(4);
    });
  });

  describe('should throw error', () => {
    it('if unable to query match by id', async () => {
      mockDatabaseService.functions.getMatchById.mockRejectedValue(undefined);
      const queriedBets = [{
        userId: userId2
      }] as BetDocument[];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
      const convertedResponse = [{ userId: userId2 }] as BetResponse[];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      await service({
        matchId,
        userId
      }).catch(validateError('Unable to query documents', 500));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList);
      expect.assertions(5);
    });

    it('if unable to query bets by match id', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue({
        startTime: addMinutes(6, now).toISOString()
      } as MatchDocument);
      mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue(undefined);

      await service({
        matchId,
        userId
      }).catch(validateError('Unable to query documents', 500));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList);
      expect.assertions(5);
    });

    it('if no match found', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);
      const queriedBets = [{
        userId: userId2
      }] as BetDocument[];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

      await service({
        matchId,
        userId
      }).catch(validateError('No match found', 404));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList);
      expect.assertions(5);
    });
  });
});
