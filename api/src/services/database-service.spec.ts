import { dynamoDatabaseService, IDatabaseService } from '@/services/database-service';
import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  MatchSaveDocument,
  MatchDetailsUpdateDocument,
  MatchTeamUpdateDocument,
  MatchTournamentUpdateDocument,
  DocumentKey
} from '@/types/documents';

describe('Database service', () => {
  let service: IDatabaseService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbTransactWriteSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbTransactWriteSpy = jest.spyOn(dynamoClient, 'transactWrite');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');

    service = dynamoDatabaseService(dynamoClient);

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
      const details: MatchDetailsUpdateDocument = {
        group: 'group',
        startTime: 'startTime'
      };
      const homeTeam: MatchTeamUpdateDocument = {
        image: 'homeImage',
        shortName: 'HMT',
        teamId: 'homeTeamId',
        teamName: 'HomeTeam'
      };
      const awayTeam: MatchTeamUpdateDocument = {
        image: 'awayImage',
        shortName: 'AWT',
        teamId: 'awayTeamId',
        teamName: 'AwayTeam'
      };
      const tournament: MatchTournamentUpdateDocument = {
        tournamentId: 'tournamentId',
        tournamentName: 'tournamentName'
      };

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatch(matchId, [details, homeTeam, awayTeam, tournament]);

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: [
          {
            Update: {
              TableName: tableName,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'details'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set startTime = :startTime, #group = :group, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#group': 'group',
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':startTime': details.startTime,
                ':group': details.group,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'details'
              }
            }
          },
          {
            Update: {
              TableName: tableName,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'homeTeam'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, teamId = :teamId, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':teamId': homeTeam.teamId,
                ':teamName': homeTeam.teamName,
                ':shortName': homeTeam.shortName,
                ':image': homeTeam.image,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'homeTeam'
              }
            }
          },
          {
            Update: {
              TableName: tableName,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'awayTeam'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, teamId = :teamId, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':teamId': awayTeam.teamId,
                ':teamName': awayTeam.teamName,
                ':shortName': awayTeam.shortName,
                ':image': awayTeam.image,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'awayTeam'
              }
            }
          },
          {
            Update: {
              TableName: tableName,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'tournament'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set tournamentName = :tournamentName, tournamentId = :tournamentId, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':tournamentId': tournament.tournamentId,
                ':tournamentName': tournament.tournamentName,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'tournament'
              }
            }
          }
        ]
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
        TransactItems: matches.map(m => ({
          Update: {
            Key: {
              ...m
            },
            TableName: tableName,
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id',
              '#segment': 'segment'
            },
            ExpressionAttributeValues: {
              ':teamName': teamName,
              ':image': image,
              ':shortName': shortName
            }
          }
        }))
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

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatchesWithTournament(matches, { tournamentName });

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: matches.map(m => ({
          Update: {
            Key: {
              ...m
            },
            TableName: tableName,
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            UpdateExpression: 'set tournamentName = :tournamentName',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id',
              '#segment': 'segment'
            },
            ExpressionAttributeValues: {
              ':tournamentName': tournamentName
            }
          }
        }))
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
      const matchSegments = ['details', 'homeTeam', 'awayTeam', 'tournament', 'finalScore'];

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteMatch(matchId);

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: matchSegments.map(m => ({
          Delete: {
            TableName: tableName,
            Key: {
              segment: m,
              'documentType-id': `match-${matchId}`,
            }
          }
        }))
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
      const match = [
        {
          segment: 'details',
        }, {
          segment: 'homeTeam'
        }, {
          segment: 'awayTeam'
        }, {
          segment: 'tournament'
        }
      ] as MatchSaveDocument;

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveMatch(match);

      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: match.map(m => ({
          Put: {
            TableName: tableName,
            Item: m
          }
        }))
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
