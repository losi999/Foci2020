import { ITeamDocumentService, teamDocumentServiceFactory } from '@/services/team-document-service';
import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument} from '@/types/documents';
import { TeamRequest } from '@/types/requests';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';

describe('Team document service', () => {
  let service: ITeamDocumentService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  let mockTeamDocumentConverter: ITeamDocumentConverter;
  let mockTeamDelete: jest.Mock;
  let mockTeamUpdate: jest.Mock;
  let mockTeamSave: jest.Mock;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');

    mockTeamDelete = jest.fn();
    mockTeamUpdate = jest.fn();
    mockTeamSave = jest.fn();
    mockTeamDocumentConverter = new (jest.fn<Partial<ITeamDocumentConverter>, undefined[]>(() => ({
      delete: mockTeamDelete,
      update: mockTeamUpdate,
      save: mockTeamSave,
    })))() as ITeamDocumentConverter;

    service = teamDocumentServiceFactory(dynamoClient, mockTeamDocumentConverter);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('updateTeam', () => {
    it('should call dynamo.update with correct parameters', async () => {
      const teamName = 'teamName';
      const teamId = 'teamId';
      const body = {
        teamName,
      } as TeamRequest;

      const convertedItem = 'converted';

      mockTeamUpdate.mockReturnValue(convertedItem);

      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.updateTeam(teamId, body);
      expect(mockTeamUpdate).toHaveBeenCalledWith(teamId, body);
      expect(dbUpdateSpy).toHaveBeenCalledWith(convertedItem);
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

  describe('deleteTeam', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      const teamId = 'teamId';

      const convertedItem = 'converted';

      mockTeamDelete.mockReturnValue(convertedItem);

      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteTeam(teamId);
      expect(mockTeamDelete).toHaveBeenCalledWith(teamId);
      expect(dbDeleteSpy).toHaveBeenCalledWith(convertedItem);
    });
  });

  describe('saveTeam', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const teamId = 'teamId';
      const body = {
        teamName: 'teamName'
      } as TeamRequest;

      const convertedItem = 'converted';

      mockTeamSave.mockReturnValue(convertedItem);

      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveTeam(teamId, body);
      expect(mockTeamSave).toHaveBeenCalledWith(teamId, body);
      expect(dbPutSpy).toHaveBeenCalledWith(convertedItem);
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
});
