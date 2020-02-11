import { IBetDocumentService, betDocumentServiceFactory } from '@/match/bet-document-service';
import { DynamoDB } from 'aws-sdk';
import { Mock, createMockService, awsResolvedValue } from '@/shared/common';
import { BetDocument } from '@/shared/types/types';

describe('Bet document service', () => {
  let service: IBetDocumentService;
  let mockDynamoClient: Mock<DynamoDB.DocumentClient>;
  const tableName = 'table-name';

  beforeEach(() => {
    mockDynamoClient = createMockService('put', 'get', 'query');
    service = betDocumentServiceFactory(tableName, mockDynamoClient.service);
  });

  const matchId = 'matchId';
  const userId = 'userId';

  describe('queryBetById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: {} }));

      await service.queryBetById(userId, matchId);

      expect(mockDynamoClient.functions.get).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `bet-${userId}-${matchId}`
        },
      }));
    });

    it('should return the queried bet', async () => {
      const queriedBet = 'bet';

      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queriedBet }));

      const result = await service.queryBetById(userId, matchId);

      expect(result).toEqual(queriedBet);
    });
  });

  describe('saveBet', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const document = {
        userId,
        matchId
      } as BetDocument;
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.saveBet(document);
      expect(mockDynamoClient.functions.put).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('queryBetsByMatchId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.queryBetsByMatchId(matchId);

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByMatchId',
        KeyConditionExpression: 'matchId = :matchId',
        ExpressionAttributeValues: {
          ':matchId': matchId,
        }
      }));
    });

    it('should return the queried items', async () => {
      const queriedBets = ['bet1', 'bet2', 'bet3'];

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedBets }));

      const result = await service.queryBetsByMatchId(matchId);

      expect(result).toEqual(queriedBets);
    });
  });
});
