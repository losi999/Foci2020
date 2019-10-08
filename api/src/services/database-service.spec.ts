import { dynamoDatabaseService, IDatabaseService } from '@/services/database-service';
import { DynamoDB } from 'aws-sdk';
import { TeamDocument, TournamentDocument, MatchDocument } from '@/types';

describe('Database service', () => {
  let service: IDatabaseService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbTransactWrite: jest.SpyInstance;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbTransactWrite = jest.spyOn(dynamoClient, 'transactWrite');
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

  describe('saveMatch', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const match = [
        {
          sortKey: 'details'
        }, {
          sortKey: 'homeTeam'
        }, {
          sortKey: 'awayTeam'
        }, {
          sortKey: 'tournament'
        }
      ] as MatchDocument;
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
                sortKey: 'details'
              }
            }
          },
          {
            Put: {
              TableName: tableName,
              Item: {
                sortKey: 'homeTeam'
              }
            }
          },
          {
            Put: {
              TableName: tableName,
              Item: {
                sortKey: 'awayTeam'
              }
            }
          },
          {
            Put: {
              TableName: tableName,
              Item: {
                sortKey: 'tournament'
              }
            }
          }
        ]
      });
    });
  });

  describe('queryTeamById', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const teamId = 'teamId';
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });
      await service.queryTeamById(teamId);
      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: 'partitionKey = :pk and sortKey = :sk',
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
    it('should call dynamo.put with correct parameters', async () => {
      const tournamentId = 'tournamentId';
      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: [] });
        }
      });
      await service.queryTournamentById(tournamentId);
      expect(dbQuerySpy).toHaveBeenCalledWith({
        TableName: tableName,
        KeyConditionExpression: 'partitionKey = :pk and sortKey = :sk',
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
});
