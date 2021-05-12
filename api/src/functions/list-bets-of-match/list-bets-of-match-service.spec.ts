import { IListBetsOfMatchService, listBetsOfMatchServiceFactory } from '@foci2020/api/functions/list-bets-of-match/list-bets-of-match-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument, betDocument, betResponse } from '@foci2020/shared/common/test-data-factory';
import { MatchIdType, UserIdType } from '@foci2020/shared/types/common';

describe('List bets of match service', () => {
  let service: IListBetsOfMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;
  const now = new Date(2020, 2, 11, 23, 55, 0);
  const matchId = 'matchId' as MatchIdType;
  const userId = 'userId' as UserIdType;
  const userId2 = 'userId2' as UserIdType;

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
      mockDatabaseService.functions.getMatchById.mockResolvedValue(matchDocument({
        startTime: addMinutes(6, now).toISOString(), 
      }));

      const queriedBets = [
        betDocument({
          userId: userId2, 
        }),
      ];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

      const convertedResponse = [
        betResponse({
          userId: userId2, 
        }),
      ];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      const result = await service({
        matchId,
        userId,
      });
      expect(result).toEqual(convertedResponse);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList, queriedBets, userId);
      expect.assertions(4);
    });

    it('with scores visible because betting time is expired', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue(matchDocument({
        startTime: addMinutes(4, now).toISOString(), 
      }));

      const queriedBets = [
        betDocument({
          userId: userId2, 
        }),
      ];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

      const convertedResponse = [
        betResponse({
          userId: userId2, 
        }),
      ];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      const result = await service({
        matchId,
        userId,
      });
      expect(result).toEqual(convertedResponse);
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList, queriedBets, undefined);
      expect.assertions(4);
    });

    it('with scores visible because player has placed a bet', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue(matchDocument({
        startTime: addMinutes(6, now).toISOString(), 
      }));

      const queriedBets = [
        betDocument(),
        betDocument({
          userId: userId2, 
        }),
      ];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

      const convertedResponse = [
        betResponse(),
        betResponse({
          userId: userId2, 
        }),
      ];
      mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

      const result = await service({
        matchId,
        userId,
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

      const queriedBets = [betDocument()];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

      await service({
        matchId,
        userId,
      }).catch(validateError('Unable to query documents', 500));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList);
      expect.assertions(5);
    });

    it('if unable to query bets by match id', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue(matchDocument({
        startTime: addMinutes(6, now).toISOString(), 
      }));
      mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue(undefined);

      await service({
        matchId,
        userId,
      }).catch(validateError('Unable to query documents', 500));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList);
      expect.assertions(5);
    });

    it('if no match found', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

      const queriedBets = [betDocument()];
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

      await service({
        matchId,
        userId,
      }).catch(validateError('No match found', 404));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockBetDocumentConverter.functions.toResponseList);
      expect.assertions(5);
    });
  });
});
