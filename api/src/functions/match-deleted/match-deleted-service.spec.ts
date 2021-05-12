import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { betDocument } from '@foci2020/shared/common/test-data-factory';
import { MatchIdType } from '@foci2020/shared/types/common';
import { IMatchDeletedService, matchDeletedServiceFactory } from '@foci2020/api/functions/match-deleted/match-deleted-service';

describe('Match deleted service', () => {
  let service: IMatchDeletedService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('queryBetsByMatchId', 'deleteDocuments');

    service = matchDeletedServiceFactory(mockDatabaseService.service);
  });

  const matchId = 'matchId' as MatchIdType;
  const queriedBet = betDocument();
  const dynamoErrorMessage = 'this is a dynamo error';

  it('should return undefined if bets are deleted', async () => {
    mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([queriedBet]);
    mockDatabaseService.functions.deleteDocuments.mockResolvedValue(undefined);

    const result = await service({
      matchId, 
    });

    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
    validateFunctionCall(mockDatabaseService.functions.deleteDocuments, [queriedBet['documentType-id']]);
    expect.assertions(3);
  });

  describe('should throw error', () => {
    it('if unable to query bets by match Id', async () => {
      mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue({
        message: dynamoErrorMessage, 
      });

      await service({
        matchId, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments);
      expect.assertions(3);
    });

    it('if unable to delete bet', async () => {
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([queriedBet]);
      mockDatabaseService.functions.deleteDocuments.mockRejectedValue({
        message: dynamoErrorMessage, 
      });

      await service({
        matchId, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments, [queriedBet['documentType-id']]);
      expect.assertions(3);
    });
  });
});
