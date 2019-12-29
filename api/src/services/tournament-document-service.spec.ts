import { ITournamentDocumentService, tournamentDocumentServiceFactory } from '@/services/tournament-document-service';
import { DynamoDB } from 'aws-sdk';
import { TournamentDocument, TournamentDocumentUpdatable } from '@/types/documents';

describe('Tournament document service', () => {
  let service: ITournamentDocumentService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  let dbGetSpy: jest.SpyInstance;

  const tableName = 'table-name';
  const tournamentId = 'tournamentId';
  const tournamentName = 'tournamentName';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');
    dbGetSpy = jest.spyOn(dynamoClient, 'get');

    service = tournamentDocumentServiceFactory(dynamoClient);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('queryTournaments', () => {
    it('should call dynamo.query with correct parameters', async () => {
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryTournaments();

      expect(dbQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
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

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: queried });
        }
      });

      const result = await service.queryTournaments();

      expect(result).toEqual(queried);
    });
  });

  describe('deleteTournament', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteTournament(tournamentId);
      expect(dbDeleteSpy).toHaveBeenCalledWith(expect.objectContaining({
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
      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveTournament(document);
      expect(dbPutSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('updateTournament', () => {
    const document: TournamentDocumentUpdatable = {
      tournamentName
    };

    it('should call dynamo.update with correct parameters', async () => {
      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve({});
        }
      });

      await service.updateTournament(tournamentId, document);
      expect(dbUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: process.env.DYNAMO_TABLE,
        ReturnValues: 'ALL_NEW',
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `tournament-${tournamentId}`,
          ':tournamentName': tournamentName
        }
      }));
    });

    it('should return the updated tournament', async () => {
      const updatedDocument = 'updatedTournament';

      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Attributes: updatedDocument });
        }
      });

      const result = await service.updateTournament(tournamentId, document);

      expect(result).toEqual(updatedDocument);
    });
  });

  describe('queryTournamentById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      dbGetSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Item: {} });
        }
      });

      await service.queryTournamentById(tournamentId);

      expect(dbGetSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        }
      }));
    });

    it('should return the queried tournament', async () => {
      const queried = 'queriedTournament';

      dbGetSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Item: queried });
        }
      });

      const result = await service.queryTournamentById(tournamentId);

      expect(result).toEqual(queried);
    });
  });
});
