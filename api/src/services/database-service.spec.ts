import { dynamoDatabaseService, IDatabaseService } from '@/services/database-service';
import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  DocumentKey
} from '@/types/documents';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchRequest } from '@/types/requests';

describe('Database service', () => {
  let service: IDatabaseService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbTransactWriteSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  let mockMatchDocumentConverter: IMatchDocumentConverter;
  let mockDelete: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockSave: jest.Mock;
  let mockUpdateMatchesWithTeam: jest.Mock;
  let mockUpdateMatchedWithTournament: jest.Mock;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbTransactWriteSpy = jest.spyOn(dynamoClient, 'transactWrite');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');

    mockDelete = jest.fn();
    mockUpdate = jest.fn();
    mockSave = jest.fn();
    mockUpdateMatchesWithTeam = jest.fn();
    mockUpdateMatchedWithTournament = jest.fn();
    mockMatchDocumentConverter = new (jest.fn<Partial<IMatchDocumentConverter>, undefined[]>(() => ({
      delete: mockDelete,
      update: mockUpdate,
      save: mockSave,
      updateMatchesWithTeam: mockUpdateMatchesWithTeam,
      updateMatchesWithTournament: mockUpdateMatchedWithTournament,
    })))() as IMatchDocumentConverter;

    service = dynamoDatabaseService(dynamoClient, mockMatchDocumentConverter);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('updateTeam', () => {
    it('should call dynamo.update with correct parameters', async () => {
      const teamName = 'teamName';
      const image = 'image';
      const shortName = 'shortName';
      const partitionKey = 'partitionKey';
      const team = {
        teamName,
        image,
        shortName,
        teamId: 'teamId',
      } as TeamDocument;

      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateTeam({
        'documentType-id': partitionKey,
        segment: 'details'
      }, team);

      expect(dbUpdateSpy).toHaveBeenCalledWith({
        Key: {
          'documentType-id': partitionKey,
          segment: 'details'
        },
        TableName: tableName,
        ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
        UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, orderingValue = :teamName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':teamName': teamName,
          ':image': image,
          ':shortName': shortName
        }
      });
    });
  });

  describe('updateMatch', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      const matchId = 'matchId';
      const body = {
        group: 'group',
      } as MatchRequest;
      const homeTeam = {
        teamId: 'homeTeamId',
      } as TeamDocument;
      const awayTeam = {
        teamId: 'awayTeamId',
      } as TeamDocument;
      const tournament = {
        tournamentId: 'tournamentId',
      } as TournamentDocument;
      const convertedItems = ['converted1', 'converted2'];

      mockUpdate.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatch(matchId, body, homeTeam, awayTeam, tournament);
      expect(mockUpdate).toHaveBeenCalledWith(matchId, body, homeTeam, awayTeam, tournament);
      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: convertedItems
      });
    });
  });

  describe('updateMatchesWithTeam', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      const teamName = 'teamName';
      const image = 'image';
      const shortName = 'shortName';
      const matches: DocumentKey<'homeTeam' | 'awayTeam'>[] = [
        {
          'documentType-id': 'match-matchId1',
          segment: 'homeTeam'
        },
        {
          'documentType-id': 'match-matchId2',
          segment: 'awayTeam'
        }
      ];

      const convertedItems = ['converted1', 'converted2'];

      mockUpdateMatchesWithTeam.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatchesWithTeam(matches, {
        teamName,
        image,
        shortName
      });

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: convertedItems
      });
    });
  });

  describe('updateMatchWithTournament', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      const tournamentName = 'tournamentName';
      const matches: DocumentKey<'tournament'>[] = [
        {
          'documentType-id': 'match-matchId1',
          segment: 'tournament'
        },
        {
          'documentType-id': 'match-matchId2',
          segment: 'tournament'
        }
      ];

      const convertedItems = ['converted1', 'converted2'];

      mockUpdateMatchedWithTournament.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatchesWithTournament(matches, { tournamentName });

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: convertedItems
      });
    });
  });

  describe('queryMatchById', () => {
    it('should call dynamo.query with correct parameters', async () => {
      const matchId = 'matchId';

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatchById(matchId);

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: '#documentTypeId = :pk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':pk': `match-${matchId}`,
        }
      });
    });

    it('should return the queried items', async () => {
      const matchId = 'matchId';
      const match1 = {
        matchId,
        segment: 'homeTeam'
      };
      const match2 = {
        matchId,
        segment: 'awayTeam'
      };

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [match1, match2] });
        }
      });

      const result = await service.queryMatchById(matchId);

      expect(result).toEqual([match1, match2]);
    });
  });

  describe('queryTeams', () => {
    it('should call dynamo.query with correct parameters', async () => {
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryTeams();

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'team'
        }
      });
    });

    it('should return the queried items', async () => {
      const team = {
        teamId: 'teamId',
        teamName: 'teamName'
      } as TeamDocument;

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [team] });
        }
      });

      const result = await service.queryTeams();

      expect(result).toEqual([team]);
    });
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

  describe('queryMatchKeysByTeamId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      const teamId = 'teamId';

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatchKeysByTeamId(teamId);

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: 'indexByTeamId',
        KeyConditionExpression: 'teamId = :teamId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':teamId': teamId,
          ':documentType': 'match',
        }
      });
    });

    it('should return the queried items', async () => {
      const teamId = 'teamId';
      const match1 = {
        matchId: 'match1'
      };
      const match2 = {
        matchId: 'match2'
      };

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [match1, match2] });
        }
      });

      const result = await service.queryMatchKeysByTeamId(teamId);

      expect(result).toEqual([match1, match2]);
    });
  });

  describe('deleteMatch', () => {
    it('should call dynamo.transactWrite with correct parameters', async () => {
      const matchId = 'matchId';

      const convertedItems = ['converted1', 'converted2'];

      mockDelete.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteMatch(matchId);

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: convertedItems
      });
    });
  });

  describe('deleteTeam', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      const teamId = 'teamId';

      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteTeam(teamId);

      expect(dbDeleteSpy).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          segment: 'details',
          'documentType-id': `team-${teamId}`,
        }
      });
    });
  });

  describe('deleteTournament', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      const tournamentId = 'tournamentId';

      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteTournament(tournamentId);

      expect(dbDeleteSpy).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          segment: 'details',
          'documentType-id': `tournament-${tournamentId}`,
        }
      });
    });
  });

  describe('saveTeam', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const team = {
        teamId: 'teamId'
      } as TeamDocument;

      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveTeam(team);

      expect(dbPutSpy).toHaveBeenCalledWith({
        TableName: tableName,
        Item: team
      });
    });
  });

  describe('saveTournament', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const tournament = {
        tournamentId: 'tournamentId'
      } as TournamentDocument;

      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveTournament(tournament);

      expect(dbPutSpy).toHaveBeenCalledWith({
        TableName: tableName,
        Item: tournament
      });
    });
  });

  describe('updateTournament', () => {
    it('should call dynamo.update with correct parameters', async () => {
      const tournamentName = 'tournamentName';
      const partitionKey = 'partitionKey';
      const tournament = {
        tournamentName,
        tournamentId: 'tournamentId',
      } as TournamentDocument;

      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateTournament({
        'documentType-id': partitionKey,
        segment: 'details'
      }, tournament);

      expect(dbUpdateSpy).toHaveBeenCalledWith({
        Key: {
          'documentType-id': partitionKey,
          segment: 'details'
        },
        TableName: tableName,
        ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':tournamentName': tournamentName
        }
      });
    });
  });

  describe('saveMatch', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const matchId = 'matchId';
      const body = {
        group: 'group',
      } as MatchRequest;
      const homeTeam = {
        teamId: 'homeTeamId',
      } as TeamDocument;
      const awayTeam = {
        teamId: 'awayTeamId',
      } as TeamDocument;
      const tournament = {
        tournamentId: 'tournamentId',
      } as TournamentDocument;

      const convertedItems = ['converted1', 'converted2'];

      mockSave.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveMatch(matchId, body, homeTeam, awayTeam, tournament);
      expect(mockSave).toHaveBeenCalledWith(matchId, body, homeTeam, awayTeam, tournament);
      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: convertedItems
      });
    });
  });

  describe('queryTeamById', () => {
    it('should call dynamo.query with correct parameters', async () => {
      const teamId = 'teamId';

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryTeamById(teamId);

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: '#documentTypeId = :pk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':pk': `team-${teamId}`,
        }
      });
    });

    it('should return the first team of the queried items', async () => {
      const teamId = 'teamId';
      const team1 = {
        teamId: 'team1'
      };
      const team2 = {
        teamId: 'team2'
      };

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [team1, team2] });
        }
      });

      const result = await service.queryTeamById(teamId);

      expect(result).toEqual(team1);
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

  describe('queryMatches', () => {
    it('should call dynamo.query with correct parameters', async () => {
      const tournamentId = 'tournamentId';

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatches(tournamentId);

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType and begins_with(orderingValue, :tournamentId)',
        ExpressionAttributeValues: {
          ':documentType': 'match',
          ':tournamentId': tournamentId
        }
      });
    });

    it('should return the queried items', async () => {
      const tournamentId = 'tournamentId';
      const match1 = {
        tournamentId
      };
      const match2 = {
        tournamentId
      };

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [match1, match2] });
        }
      });

      const result = await service.queryMatches(tournamentId);

      expect(result).toEqual([match1, match2]);
    });
  });

  describe('queryMatchKeysByTournamentId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      const tournamentId = 'tournamentId';

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });

      await service.queryMatchKeysByTournamentId(tournamentId);

      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: 'indexByTournamentId',
        KeyConditionExpression: 'tournamentId = :tournamentId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':tournamentId': tournamentId,
          ':documentType': 'match',
        }
      });
    });

    it('should return the queried items', async () => {
      const tournamentId = 'tournamentId';
      const match1 = {
        matchId: 'match1'
      };
      const match2 = {
        matchId: 'match2'
      };

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [match1, match2] });
        }
      });

      const result = await service.queryMatchKeysByTournamentId(tournamentId);

      expect(result).toEqual([match1, match2]);
    });
  });
});
