import { dynamoDatabaseService, IDatabaseService } from '@/services/database-service';
import { DynamoDB } from 'aws-sdk';
import { TeamDocument, TournamentDocument, MatchSaveDocument } from '@/types/documents';

describe('Database service', () => {
  let service: IDatabaseService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbTransactWrite: jest.SpyInstance;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbTransactWrite = jest.spyOn(dynamoClient, 'transactWrite');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    service = dynamoDatabaseService(dynamoClient);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
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

  // describe('updateTournament', () => {
  //   it('should call dynamo.put with correct parameters', async () => {
  //     const tournament = {
  //       tournamentId: 'tournamentId'
  //     } as TournamentDocument;
  //     dbPutSpy.mockReturnValue({
  //       promise() {
  //         return Promise.resolve(undefined);
  //       }
  //     });
  //     await service.updateTournament(tournament);
  //     expect(dbPutSpy).toHaveBeenCalledWith({
  //       TableName: tableName,
  //       Item: tournament
  //     });
  //   });
  // });

  // describe('updateMatchWithTournament', () => {
  //   it('should call dynamo.update with correct parameters', async () => {
  //     const partitionKey = 'partitionKey';
  //     const sortKey = 'tournament';
  //     const tournamentName = 'tournamentName';

  //     dbUpdateSpy.mockReturnValue({
  //       promise() {
  //         return Promise.resolve(undefined);
  //       }
  //     });
  //     await service.updateMatchWithTournament({
  //       partitionKey,
  //       sortKey
  //     }, { tournamentName });
  //     expect(dbUpdateSpy).toHaveBeenCalledWith({
  //       TableName: tableName,
  //       Key: {
  //         partitionKey,
  //         sortKey
  //       },
  //       UpdateExpression: 'set tournamentName = :tournamentName',
  //       ExpressionAttributeValues: {
  //         ':tournamentName': tournamentName
  //       }
  //     });
  //   });
  // });

  describe('saveMatch', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const match = [
        {
          segment: 'details'
        }, {
          segment: 'homeTeam'
        }, {
          segment: 'awayTeam'
        }, {
          segment: 'tournament'
        }
      ] as MatchSaveDocument;
      dbTransactWrite.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });
      await service.saveMatch(match);
      expect(dbTransactWrite).toHaveBeenCalledWith({
        TransactItems: [
          {
            Put: {
              TableName: tableName,
              Item: {
                segment: 'details'
              }
            }
          },
          {
            Put: {
              TableName: tableName,
              Item: {
                segment: 'homeTeam'
              }
            }
          },
          {
            Put: {
              TableName: tableName,
              Item: {
                segment: 'awayTeam'
              }
            }
          },
          {
            Put: {
              TableName: tableName,
              Item: {
                segment: 'tournament'
              }
            }
          }
        ]
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
        KeyConditionExpression: '#documentTypeId = :pk and #segment = :sk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':pk': `team-${teamId}`,
          ':sk': 'details'
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
        KeyConditionExpression: '#documentTypeId = :pk and #segment = :sk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':pk': `tournament-${tournamentId}`,
          ':sk': 'details'
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

  // describe('queryMatchesByDocumentType', () => {
  //   it('should call dynamo.query with correct parameters', async () => {
  //     dbQuerySpy.mockReturnValue({
  //       promise() {
  //         return Promise.resolve({ Items: [] });
  //       }
  //     });
  //     await service.queryMatchesByDocumentType();
  //     expect(dbQuerySpy).toHaveBeenCalledWith({
  //       TableName: tableName,
  //       IndexName: 'indexByDocumentType',
  //       KeyConditionExpression: 'documentType = :documentType',
  //       ExpressionAttributeValues: {
  //         ':documentType': 'match',
  //       }
  //     });
  //   });

  //   it('should return the queried items', async () => {
  //     const tournament1 = {
  //       tournamentId: 'tournament1'
  //     };
  //     const tournament2 = {
  //       tournamentId: 'tournament2'
  //     };
  //     dbQuerySpy.mockReturnValue({
  //       promise() {
  //         return Promise.resolve({ Items: [tournament1, tournament2] });
  //       }
  //     });
  //     const result = await service.queryMatchesByDocumentType();
  //     expect(result).toEqual([tournament1, tournament2]);
  //   });
  // });

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
      const result = await service.queryMatchKeysByTournamentId(tournamentId);
      expect(result).toEqual([tournament1, tournament2]);
    });
  });
});
