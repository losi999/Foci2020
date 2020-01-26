import { IMatchDocumentService, matchDocumentServiceFactory } from '@/services/match-document-service';
import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  MatchDocumentUpdatable,
  MatchDocument
} from '@/types/documents';

describe('Match document service', () => {
  let service: IMatchDocumentService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  let dbGetSpy: jest.SpyInstance;
  let dbTransactWriteSpy: jest.SpyInstance;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');
    dbGetSpy = jest.spyOn(dynamoClient, 'get');
    dbTransactWriteSpy = jest.spyOn(dynamoClient, 'transactWrite');

    service = matchDocumentServiceFactory(dynamoClient);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
    jest.resetAllMocks();
  });

  const matchId = 'matchId';
  const startTime = 'startTime';
  const group = 'group';
  const homeTeamId = 'homeTeamId';
  const awayTeamId = 'awayTeamId';
  const tournamentId = 'tournamentId';
  const homeTeam = { id: homeTeamId } as TeamDocument;
  const awayTeam = { id: awayTeamId } as TeamDocument;
  const tournament = { id: tournamentId } as TournamentDocument;

  describe('updateMatch', () => {
    it('should call dynamo.update with correct parameters', async () => {
      const document = {
        startTime,
        group,
        homeTeam,
        awayTeam,
        awayTeamId,
        homeTeamId,
        tournament,
        tournamentId
      } as MatchDocumentUpdatable;
      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatch(matchId, document);
      expect(dbUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match-${matchId}`
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set startTime = :startTime, #group = :group, orderingValue = :orderingValue, homeTeamId = :homeTeamId, awayTeamId = :awayTeamId, tournamentId = :tournamentId, homeTeam = :homeTeam, awayTeam = :awayTeam, tournament = :tournament',
        ExpressionAttributeNames: {
          '#group': 'group',
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':startTime': startTime,
          ':group': group,
          ':orderingValue': `${tournamentId}-${startTime}`,
          ':documentTypeId': `match-${matchId}`,
          ':homeTeamId': homeTeamId,
          ':awayTeamId': awayTeamId,
          ':tournamentId': tournamentId,
          ':homeTeam': homeTeam,
          ':awayTeam': awayTeam,
          ':tournament': tournament
        }
      }));
    });
  });

  describe('updateTeamOfMatches', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateTeamOfMatches([matchId], homeTeam, 'home');

      expect(dbTransactWriteSpy).toHaveBeenCalledWith(expect.objectContaining({
        TransactItems: [{
          Update: {
            TableName: tableName,
            Key: {
              'documentType-id': `match-${matchId}`,
            },
            ConditionExpression: '#documentTypeId = :documentTypeId',
            UpdateExpression: 'set #team = :team',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id',
              '#team': 'homeTeam'
            },
            ExpressionAttributeValues: {
              ':documentTypeId': `match-${matchId}`,
              ':team': homeTeam,
            }
          }
        }]
      }));
    });
  });

  describe('updateTournamentOfMatches', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateTournamentOfMatches([matchId], tournament);

      expect(dbTransactWriteSpy).toHaveBeenCalledWith(expect.objectContaining({
        TransactItems: [{
          Update: {
            TableName: tableName,
            Key: {
              'documentType-id': `match-${matchId}`,
            },
            ConditionExpression: '#documentTypeId = :documentTypeId',
            UpdateExpression: 'set tournament = :tournament',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id'
            },
            ExpressionAttributeValues: {
              ':documentTypeId': `match-${matchId}`,
              ':tournament': tournament
            }
          }
        }]
      }));
    });
  });

  describe('queryMatchById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      dbGetSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Item: {} });
        }
      });

      await service.queryMatchById(matchId);

      expect(dbGetSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match-${matchId}`
        },
      }));
    });

    it('should return the queried match', async () => {
      const queriedMatch = 'match';

      dbGetSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Item: queriedMatch });
        }
      });

      const result = await service.queryMatchById(matchId);

      expect(result).toEqual(queriedMatch);
    });
  });

  describe('queryMatchKeysByHomeTeamId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatchKeysByHomeTeamId(homeTeamId);

      expect(dbQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByHomeTeamId',
        KeyConditionExpression: 'homeTeamId = :teamId',
        ExpressionAttributeValues: {
          ':teamId': homeTeamId,
        }
      }));
    });

    it('should return the queried matches', async () => {
      const queriedMatches = ['match1', 'match2', 'match3'];

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: queriedMatches });
        }
      });

      const result = await service.queryMatchKeysByHomeTeamId(homeTeamId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('queryMatchKeysByAwayTeamId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatchKeysByAwayTeamId(awayTeamId);

      expect(dbQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByAwayTeamId',
        KeyConditionExpression: 'awayTeamId = :teamId',
        ExpressionAttributeValues: {
          ':teamId': awayTeamId,
        }
      }));
    });

    it('should return the queried matches', async () => {
      const queriedMatches = ['match1', 'match2', 'match3'];

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: queriedMatches });
        }
      });

      const result = await service.queryMatchKeysByHomeTeamId(homeTeamId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('deleteMatch', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteMatch(matchId);

      expect(dbDeleteSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match-${matchId}`,
        }
      }));
    });
  });

  describe('saveMatch', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const document = {
        startTime,
        group,
        homeTeam,
        awayTeam,
        awayTeamId,
        homeTeamId,
        tournament,
        tournamentId
      } as MatchDocument;
      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveMatch(document);
      expect(dbPutSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('queryMatches', () => {
    it('should call dynamo.query with correct parameters', async () => {
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatches(tournamentId);

      expect(dbQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType and begins_with(orderingValue, :tournamentId)',
        ExpressionAttributeValues: {
          ':documentType': 'match',
          ':tournamentId': tournamentId
        }
      }));
    });

    it('should return the queried items', async () => {
      const queriedMatches = ['match1', 'match2', 'match3'];

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: queriedMatches });
        }
      });

      const result = await service.queryMatches(tournamentId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('queryMatchKeysByTournamentId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatchKeysByTournamentId(tournamentId);

      expect(dbQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByTournamentId',
        KeyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: {
          ':tournamentId': tournamentId,
        }
      }));
    });

    it('should return the queried items', async () => {
      const queriedMatches = ['match1', 'match2', 'match3'];

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: queriedMatches });
        }
      });

      const result = await service.queryMatchKeysByTournamentId(tournamentId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('deleteMatches', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteMatches([matchId]);

      expect(dbTransactWriteSpy).toHaveBeenCalledWith(expect.objectContaining({
        TransactItems: [{
          Delete: {
            TableName: tableName,
            Key: {
              'documentType-id': `match-${matchId}`,
            },
            ConditionExpression: '#documentTypeId = :documentTypeId',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id'
            },
            ExpressionAttributeValues: {
              ':documentTypeId': `match-${matchId}`,
            }
          }
        }]
      }));
    });
  });
});
