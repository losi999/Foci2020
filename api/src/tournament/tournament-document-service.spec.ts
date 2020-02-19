import { ITournamentDocumentService, tournamentDocumentServiceFactory } from '@/tournament/tournament-document-service';
import { DynamoDB } from 'aws-sdk';
import { TournamentDocument } from '@/shared/types/types';
import { Mock, createMockService, awsResolvedValue } from '@/shared/common';

describe('Tournament document service', () => {
  let service: ITournamentDocumentService;
  let mockDynamoClient: Mock<DynamoDB.DocumentClient>;

  const tableName = 'table-name';
  const tournamentId = 'tournamentId';
  const tournamentName = 'tournamentName';

  beforeEach(() => {
    mockDynamoClient = createMockService('put', 'query', 'get', 'delete');

    service = tournamentDocumentServiceFactory(tableName, mockDynamoClient.service);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('queryTournaments', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.queryTournaments();

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament'
        }
      }));
    });

    it('should return the queried tournaments', async () => {
      const queried = [1, 2, 3];

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queried }));

      const result = await service.queryTournaments();

      expect(result).toEqual(queried);
    });
  });

  describe('deleteTournament', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue());

      await service.deleteTournament(tournamentId);
      expect(mockDynamoClient.functions.delete).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        }
      }));
    });
  });

  describe('saveTournament', () => {
    const document = {
      tournamentName
    } as TournamentDocument;

    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.saveTournament(document);
      expect(mockDynamoClient.functions.put).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('updateTournament', () => {
    const documentTypeId = 'tournament-id1';
    const document: TournamentDocument = {
      tournamentName,
      'documentType-id': documentTypeId
    } as TournamentDocument;

    it('should call dynamo.update with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.updateTournament(document);
      expect(mockDynamoClient.functions.put).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': documentTypeId,
        }
      }));
    });
  });

  describe('queryTournamentById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: {} }));

      await service.queryTournamentById(tournamentId);

      expect(mockDynamoClient.functions.get).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        }
      }));
    });

    it('should return the queried tournament', async () => {
      const queried = 'queriedTournament';

      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queried }));

      const result = await service.queryTournamentById(tournamentId);

      expect(result).toEqual(queried);
    });
  });
});
