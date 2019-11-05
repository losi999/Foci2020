import { IMatchDocumentService, matchDocumentServiceFactory } from '@/services/match-document-service';
import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  DocumentKey
} from '@/types/documents';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchRequest } from '@/types/requests';

describe('Match document service', () => {
  let service: IMatchDocumentService;
  let dbQuerySpy: jest.SpyInstance;
  let dbTransactWriteSpy: jest.SpyInstance;
  let mockMatchDocumentConverter: IMatchDocumentConverter;
  let mockMatchDelete: jest.Mock;
  let mockMatchUpdate: jest.Mock;
  let mockMatchSave: jest.Mock;
  let mockUpdateMatchesWithTeam: jest.Mock;
  let mockUpdateMatchedWithTournament: jest.Mock;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbTransactWriteSpy = jest.spyOn(dynamoClient, 'transactWrite');

    mockMatchDelete = jest.fn();
    mockMatchUpdate = jest.fn();
    mockMatchSave = jest.fn();
    mockUpdateMatchesWithTeam = jest.fn();
    mockUpdateMatchedWithTournament = jest.fn();
    mockMatchDocumentConverter = new (jest.fn<Partial<IMatchDocumentConverter>, undefined[]>(() => ({
      delete: mockMatchDelete,
      update: mockMatchUpdate,
      save: mockMatchSave,
      updateMatchesWithTeam: mockUpdateMatchesWithTeam,
      updateMatchesWithTournament: mockUpdateMatchedWithTournament,
    })))() as IMatchDocumentConverter;

    service = matchDocumentServiceFactory(dynamoClient, mockMatchDocumentConverter);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
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

      mockMatchUpdate.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateMatch(matchId, body, homeTeam, awayTeam, tournament);
      expect(mockMatchUpdate).toHaveBeenCalledWith(matchId, body, homeTeam, awayTeam, tournament);
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

      mockMatchDelete.mockReturnValue(convertedItems);

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

      mockMatchSave.mockReturnValue(convertedItems);

      dbTransactWriteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveMatch(matchId, body, homeTeam, awayTeam, tournament);
      expect(mockMatchSave).toHaveBeenCalledWith(matchId, body, homeTeam, awayTeam, tournament);
      expect(dbTransactWriteSpy).toHaveBeenCalledWith({
        TransactItems: convertedItems
      });
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
