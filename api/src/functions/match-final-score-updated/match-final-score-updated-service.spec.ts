import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument, betDocument } from '@foci2020/shared/common/test-data-factory';
import { IMatchFinalScoreUpdatedService, matchFinalScoreUpdatedServiceFactory } from '@foci2020/api/functions/match-final-score-updated/match-final-score-updated-service';

describe('Match final score updated service', () => {
  let service: IMatchFinalScoreUpdatedService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('putDocuments', 'queryBetsByMatchId');
    mockBetDocumentConverter = createMockService('calculateResult');

    service = matchFinalScoreUpdatedServiceFactory(mockDatabaseService.service, mockBetDocumentConverter.service);
  });

  const matchWithScore = matchDocument({
    finalScore: {
      homeScore: 1,
      awayScore: 0,
    },
  });
  const queriedBet = betDocument();
  const convertedBet = betDocument();
  const message = 'This is a dynamo error';
  const matchWithoutScore = matchDocument();

  it('should return undefined if bets are updated', async () => {
    mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([queriedBet]);
    mockBetDocumentConverter.functions.calculateResult.mockReturnValue(convertedBet);
    mockDatabaseService.functions.putDocuments.mockResolvedValue(undefined);

    await service({
      match: matchWithScore, 
    });

    validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchWithScore.id);
    validateFunctionCall(mockBetDocumentConverter.functions.calculateResult, queriedBet, matchWithScore.finalScore);
    validateFunctionCall(mockDatabaseService.functions.putDocuments, [convertedBet]);
  });

  describe('should throw error', () => {
    it('if unable to query bets by match id', async () => {
      mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue({
        message, 
      });

      await service({
        match: matchWithoutScore, 
      }).catch((validateError(message)));

      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchWithoutScore.id);
      validateFunctionCall(mockBetDocumentConverter.functions.calculateResult);
      validateFunctionCall(mockDatabaseService.functions.putDocuments);
    });

    it('if unable to update bet', async () => {
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([queriedBet]);
      mockBetDocumentConverter.functions.calculateResult.mockReturnValue(convertedBet);
      mockDatabaseService.functions.putDocuments.mockRejectedValue({
        message, 
      });

      await service({
        match: matchWithScore, 
      }).catch((validateError(message)));

      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchWithScore.id);
      validateFunctionCall(mockBetDocumentConverter.functions.calculateResult, queriedBet, matchWithScore.finalScore);
      validateFunctionCall(mockDatabaseService.functions.putDocuments, [convertedBet]);
    });
  });
});
