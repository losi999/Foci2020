import { IStandingDocumentService, standingDocumentServiceFactory } from '@/services/standing-document-service';
import { DynamoDB } from 'aws-sdk';
import { Mock, createMockService, awsResolvedValue } from '@/common';
import { StandingDocument } from '@/types/types';

describe('Standing document service', () => {
  let service: IStandingDocumentService;
  let mockDynamoClient: Mock<DynamoDB.DocumentClient>;
  const tableName = 'table-name';

  beforeEach(() => {
    mockDynamoClient = createMockService('put', 'get', 'query', 'delete');
    service = standingDocumentServiceFactory(tableName, mockDynamoClient.service);
  });

  describe('saveStanding', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const document = {
        userName: 'user1'
      } as StandingDocument;
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.saveStanding(document);
      expect(mockDynamoClient.functions.put).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });
});
