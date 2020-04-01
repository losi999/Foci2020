import { IDatabaseService, databaseServiceFactory } from '@/services/database-service';
import { Mock, createMockService, awsResolvedValue, validateFunctionCall } from '@/common/unit-testing';
import { DynamoDB } from 'aws-sdk';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/types/types';
import { betDocument, matchDocument, standingDocument, teamDocument, tournamentDocument } from '@/common/test-data-factory';

describe('Database service', () => {
  let service: IDatabaseService;
  let mockDynamoClient: Mock<DynamoDB.DocumentClient>;
  const tableName = 'table-name';

  beforeEach(() => {
    mockDynamoClient = createMockService('put', 'get', 'query', 'delete', 'update');

    service = databaseServiceFactory(tableName, mockDynamoClient.service);
  });

  describe('saveBet', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = betDocument();

      await service.saveBet(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('saveMatch', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = matchDocument();

      await service.saveMatch(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('saveStanding', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = standingDocument();

      await service.saveStanding(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('saveTeam', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = teamDocument();

      await service.saveTeam(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('saveTournament', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = tournamentDocument();

      await service.saveTournament(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('deleteBet', () => {
    it('should call dynamo.delete with correct parameters and return queried data', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue());

      const userId = 'userId';
      const matchId = 'matchId';

      await service.deleteBet(userId, matchId);
      validateFunctionCall(mockDynamoClient.functions.delete, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `bet#${userId}#${matchId}`,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('deleteMatch', () => {
    it('should call dynamo.delete with correct parameters and return queried data', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue());

      const matchId = 'matchId';

      await service.deleteMatch(matchId);
      validateFunctionCall(mockDynamoClient.functions.delete, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('deleteTeam', () => {
    it('should call dynamo.delete with correct parameters and return queried data', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue());

      const teamId = 'teamId';

      await service.deleteTeam(teamId);
      validateFunctionCall(mockDynamoClient.functions.delete, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `team#${teamId}`,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('deleteTournament', () => {
    it('should call dynamo.delete with correct parameters and return queried data', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue());

      const tournamentId = 'tournamentId';

      await service.deleteTournament(tournamentId);
      validateFunctionCall(mockDynamoClient.functions.delete, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `tournament#${tournamentId}`,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('getMatchById', () => {
    it('should call dynamo.get with correct parameters and return queried data', async () => {
      const matchId = 'matchId';
      const queriedItem = matchDocument();
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queriedItem }));

      const result = await service.getMatchById(matchId);
      expect(result).toEqual(queriedItem);
      validateFunctionCall(mockDynamoClient.functions.get, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`
        },
      });
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('getTeamById', () => {
    it('should call dynamo.get with correct parameters and return queried data', async () => {
      const teamId = 'teamId';
      const queriedItem = teamDocument();
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queriedItem }));

      const result = await service.getTeamById(teamId);
      expect(result).toEqual(queriedItem);
      validateFunctionCall(mockDynamoClient.functions.get, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `team#${teamId}`
        },
      });
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('getTournamentById', () => {
    it('should call dynamo.get with correct parameters and return queried data', async () => {
      const tournamentId = 'tournamentId';
      const queriedItem = tournamentDocument();
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queriedItem }));

      const result = await service.getTournamentById(tournamentId);
      expect(result).toEqual(queriedItem);
      validateFunctionCall(mockDynamoClient.functions.get, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `tournament#${tournamentId}`
        },
      });
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('getBetById', () => {
    it('should call dynamo.get with correct parameters and return queried data', async () => {
      const matchId = 'matchId';
      const userId = 'userId';
      const queriedItem = betDocument();
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: queriedItem }));

      const result = await service.getBetById(userId, matchId);
      expect(result).toEqual(queriedItem);
      validateFunctionCall(mockDynamoClient.functions.get, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `bet#${userId}#${matchId}`
        },
      });
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('queryBetsByMatchId', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const matchId = 'matchId';
      const queriedItems = [betDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.queryBetsByMatchId(matchId);
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        TableName: tableName,
        IndexName: 'indexByMatchIdDocumentType',
        ReturnConsumedCapacity: 'INDEXES',
        KeyConditionExpression: '#matchIdDocumentType = :matchIdDocumentType',
        ExpressionAttributeNames: {
          '#matchIdDocumentType': 'matchId-documentType'
        },
        ExpressionAttributeValues: {
          ':matchIdDocumentType': `${matchId}#bet`
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('queryBetsByTournamentIdUserId', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const tournamentId = 'tournamentId';
      const userId = 'userId';
      const queriedItems = [betDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.queryBetsByTournamentIdUserId(tournamentId, userId);
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        TableName: tableName,
        IndexName: 'indexByTournamentIdUserIdDocumentType',
        ReturnConsumedCapacity: 'INDEXES',
        KeyConditionExpression: '#ournamentIdUserIdDocumentType = :ournamentIdUserIdDocumentType',
        ExpressionAttributeNames: {
          '#ournamentIdUserIdDocumentType': 'tournamentId-userId-documentType'
        },
        ExpressionAttributeValues: {
          ':ournamentIdUserIdDocumentType': `${tournamentId}#${userId}#bet`
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('queryMatchesByTournamentId', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const tournamentId = 'tournamentId';
      const queriedItems = [matchDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.queryMatchesByTournamentId(tournamentId);
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByTournamentIdDocumentType',
        KeyConditionExpression: '#tournamentIdDocumentType = :tournamentIdDocumentType',
        ScanIndexForward: true,
        ExpressionAttributeNames: {
          '#tournamentIdDocumentType': 'tournamentId-documentType'
        },
        ExpressionAttributeValues: {
          ':tournamentIdDocumentType': `${tournamentId}#match`
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('queryStandingsByTournamentId', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const tournamentId = 'tournamentId';
      const queriedItems = [standingDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.queryStandingsByTournamentId(tournamentId);
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByTournamentIdDocumentType',
        KeyConditionExpression: '#tournamentIdDocumentType = :tournamentIdDocumentType',
        ScanIndexForward: false,
        ExpressionAttributeNames: {
          '#tournamentIdDocumentType': 'tournamentId-documentType'
        },
        ExpressionAttributeValues: {
          ':tournamentIdDocumentType': `${tournamentId}#standing`
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('queryMatchKeysByHomeTeamId', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const teamId = 'teamId';
      const queriedItems = [{
        id: 'matchId'
      }] as IndexByHomeTeamIdDocument[];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.queryMatchKeysByHomeTeamId(teamId);
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByHomeTeamIdDocumentType',
        KeyConditionExpression: '#homeTeamIdDocumentType = :homeTeamIdDocumentType',
        ExpressionAttributeNames: {
          '#homeTeamIdDocumentType': 'homeTeamId-documentType'
        },
        ExpressionAttributeValues: {
          ':homeTeamIdDocumentType': `${teamId}#match`,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('queryMatchKeysByAwayTeamId', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const teamId = 'teamId';
      const queriedItems = [{
        id: 'matchId'
      }] as IndexByAwayTeamIdDocument[];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.queryMatchKeysByAwayTeamId(teamId);
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByAwayTeamIdDocumentType',
        KeyConditionExpression: '#awayTeamIdDocumentType = :awayTeamIdDocumentType',
        ExpressionAttributeNames: {
          '#awayTeamIdDocumentType': 'awayTeamId-documentType'
        },
        ExpressionAttributeValues: {
          ':awayTeamIdDocumentType': `${teamId}#match`,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('listMatches', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const queriedItems = [matchDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.listMatches();
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'match',
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('listTeams', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const queriedItems = [teamDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.listTeams();
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'team',
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('listTournaments', () => {
    it('should call dynamo.query with correct parameters and return queried data', async () => {
      const queriedItems = [tournamentDocument()];
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: queriedItems }));

      const result = await service.listTournaments();
      expect(result).toEqual(queriedItems);
      validateFunctionCall(mockDynamoClient.functions.query, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament',
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(6);
    });
  });

  describe('updateBet', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = betDocument();

      await service.updateBet(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': document['documentType-id'],
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('updateMatch', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = matchDocument();

      await service.updateMatch(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': document['documentType-id'],
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('updateTeamOfMatch', () => {
    it('should call dynamo.update with correct parameters', async () => {
      mockDynamoClient.functions.update.mockReturnValue(awsResolvedValue());

      const matchId = 'matchId';
      const team = teamDocument();
      const type = 'home';

      await service.updateTeamOfMatch(matchId, team, type);
      validateFunctionCall(mockDynamoClient.functions.update, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set #team = :team',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#team': `${type}Team`
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match#${matchId}`,
          ':team': team,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      expect.assertions(5);
    });
  });

  describe('updateTournamentOfMatch', () => {
    it('should call dynamo.update with correct parameters', async () => {
      mockDynamoClient.functions.update.mockReturnValue(awsResolvedValue());

      const matchId = 'matchId';
      const tournament = tournamentDocument();

      await service.updateTournamentOfMatch(matchId, tournament);
      validateFunctionCall(mockDynamoClient.functions.update, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Key: {
          'documentType-id': `match#${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournament = :tournament',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match#${matchId}`,
          ':tournament': tournament,
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.put);
      expect.assertions(5);
    });
  });

  describe('updateTournament', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = tournamentDocument();

      await service.updateTournament(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': document['documentType-id'],
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });

  describe('updateTeam', () => {
    it('should call dynamo.put with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      const document = teamDocument();

      await service.updateTeam(document);
      validateFunctionCall(mockDynamoClient.functions.put, {
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': document['documentType-id'],
        }
      });
      validateFunctionCall(mockDynamoClient.functions.get);
      validateFunctionCall(mockDynamoClient.functions.query);
      validateFunctionCall(mockDynamoClient.functions.delete);
      validateFunctionCall(mockDynamoClient.functions.update);
      expect.assertions(5);
    });
  });
});