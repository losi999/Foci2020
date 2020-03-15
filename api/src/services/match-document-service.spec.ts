import { IMatchDocumentService, matchDocumentServiceFactory } from '@/services/match-document-service';
import { DynamoDB } from 'aws-sdk';
import { Mock, createMockService, awsResolvedValue } from '@/common';
import { TeamDocument, TournamentDocument, MatchDocument } from '@/types/types';

describe('Match document service', () => {
  let service: IMatchDocumentService;
  let mockDynamoClient: Mock<DynamoDB.DocumentClient>;
  const tableName = 'table-name';

  beforeEach(() => {
    mockDynamoClient = createMockService('put', 'query', 'delete', 'get', 'transactWrite', 'update');

    service = matchDocumentServiceFactory(tableName, mockDynamoClient.service);
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
      const documentTypeId = 'match-id1';
      const document = {
        startTime,
        group,
        homeTeam,
        awayTeam,
        awayTeamId,
        homeTeamId,
        tournament,
        tournamentId,
        'documentType-id': documentTypeId
      } as MatchDocument;
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.updateMatch(document);
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

  describe('updateTeamOfMatch', () => {
    it('should call dynamo.update with correct parameters', async () => {
      mockDynamoClient.functions.update.mockReturnValue(awsResolvedValue());

      await service.updateTeamOfMatch(matchId, homeTeam, 'home');

      expect(mockDynamoClient.functions.update).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set #team = :team',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#team': 'homeTeam'
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match#${matchId}`,
          ':team': homeTeam,
        }
      }));
    });
  });

  describe('updateTournamentOfMatch', () => {
    it('should call dynamo.update with correct parameters', async () => {
      mockDynamoClient.functions.update.mockReturnValue(awsResolvedValue());

      await service.updateTournamentOfMatch(matchId, tournament);

      expect(mockDynamoClient.functions.update).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournament = :tournament',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id'
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match#${matchId}`,
          ':tournament': tournament
        }
      }));
    });
  });

  describe('queryMatchById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: {} }));

      await service.queryMatchById(matchId);

      expect(mockDynamoClient.functions.get).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`
        },
      }));
    });

    it('should return the queried match', async () => {
      const queriedMatch = 'match';

      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queriedMatch }));

      const result = await service.queryMatchById(matchId);

      expect(result).toEqual(queriedMatch);
    });
  });

  describe('queryMatchKeysByHomeTeamId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.queryMatchKeysByHomeTeamId(homeTeamId);

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
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

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedMatches }));

      const result = await service.queryMatchKeysByHomeTeamId(homeTeamId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('queryMatchKeysByAwayTeamId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.queryMatchKeysByAwayTeamId(awayTeamId);

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
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

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedMatches }));

      const result = await service.queryMatchKeysByHomeTeamId(homeTeamId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('deleteMatch', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue());

      await service.deleteMatch(matchId);

      expect(mockDynamoClient.functions.delete).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`,
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
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.saveMatch(document);
      expect(mockDynamoClient.functions.put).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('queryMatches', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.queryMatches(tournamentId);

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
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

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedMatches }));

      const result = await service.queryMatches(tournamentId);

      expect(result).toEqual(queriedMatches);
    });
  });

  describe('queryMatchKeysByTournamentId', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.queryMatchKeysByTournamentId(tournamentId);

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
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

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedMatches }));

      const result = await service.queryMatchKeysByTournamentId(tournamentId);

      expect(result).toEqual(queriedMatches);
    });
  });
});
