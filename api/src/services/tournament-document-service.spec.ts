import { ITournamentDocumentService, tournamentDocumentServiceFactory } from '@/services/tournament-document-service';
import { DynamoDB } from 'aws-sdk';
import {
  TournamentDocument} from '@/types/documents';
import { TournamentRequest } from '@/types/requests';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

describe('Tournament document service', () => {
  let service: ITournamentDocumentService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  let mockTournamentDocumentConverter: ITournamentDocumentConverter;
  let mockTournamentDelete: jest.Mock;
  let mockTournamentUpdate: jest.Mock;
  let mockTournamentSave: jest.Mock;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');

    mockTournamentDelete = jest.fn();
    mockTournamentUpdate = jest.fn();
    mockTournamentSave = jest.fn();
    mockTournamentDocumentConverter = new (jest.fn<Partial<ITournamentDocumentConverter>, undefined[]>(() => ({
      delete: mockTournamentDelete,
      update: mockTournamentUpdate,
      save: mockTournamentSave,
    })))() as ITournamentDocumentConverter;

    service = tournamentDocumentServiceFactory(dynamoClient, mockTournamentDocumentConverter);

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

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament'
        }
      });
    });

    it('should return the queried items', async () => {
      const tournament = {
        tournamentId: 'tournamentId',
        tournamentName: 'tournamentName'
      } as TournamentDocument;

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [tournament] });
        }
      });

      const result = await service.queryTournaments();

      expect(result).toEqual([tournament]);
    });
  });

  describe('deleteTournament', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      const tournamentId = 'tournamentId';

      const convertedItem = 'converted';

      mockTournamentDelete.mockReturnValue(convertedItem);

      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteTournament(tournamentId);
      expect(mockTournamentDelete).toHaveBeenCalledWith(tournamentId);
      expect(dbDeleteSpy).toHaveBeenCalledWith(convertedItem);
    });
  });

  describe('saveTournament', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const tournamentId = 'tournamentId';
      const body = {
        tournamentName: 'tournamentName'
      } as TournamentRequest;

      const convertedItem = 'converted';

      mockTournamentSave.mockReturnValue(convertedItem);

      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveTournament(tournamentId, body);
      expect(mockTournamentSave).toHaveBeenCalledWith(tournamentId, body);
      expect(dbPutSpy).toHaveBeenCalledWith(convertedItem);
    });
  });

  describe('updateTournament', () => {
    it('should call dynamo.update with correct parameters', async () => {
      const tournamentId = 'tournamentId';
      const body = {
        tournamentName: 'tournamentName'
      } as TournamentRequest;

      const convertedItem = 'converted';

      mockTournamentUpdate.mockReturnValue(convertedItem);

      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateTournament(tournamentId, body);
      expect(mockTournamentUpdate).toHaveBeenCalledWith(tournamentId, body);
      expect(dbUpdateSpy).toHaveBeenCalledWith(convertedItem);
    });
  });

  describe('queryTournamentById', () => {
    it('should call dynamo.query with correct parameters', async () => {
      const tournamentId = 'tournamentId';

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryTournamentById(tournamentId);

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: '#documentTypeId = :pk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':pk': `tournament-${tournamentId}`,
        }
      });
    });

    it('should return the first tournament of the queried items', async () => {
      const tournamentId = 'tournamentId';
      const tournament1 = {
        tournamentId: 'tournament1'
      };
      const tournament2 = {
        tournamentId: 'tournament2'
      };

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [tournament1, tournament2] });
        }
      });

      const result = await service.queryTournamentById(tournamentId);

      expect(result).toEqual(tournament1);
    });
  });
});
