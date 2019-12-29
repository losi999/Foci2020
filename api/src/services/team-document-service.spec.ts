import { ITeamDocumentService, teamDocumentServiceFactory } from '@/services/team-document-service';
import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument, TeamDocumentUpdatable
} from '@/types/documents';

describe('Team document service', () => {
  let service: ITeamDocumentService;
  let dbPutSpy: jest.SpyInstance;
  let dbQuerySpy: jest.SpyInstance;
  let dbUpdateSpy: jest.SpyInstance;
  let dbDeleteSpy: jest.SpyInstance;
  let dbGetSpy: jest.SpyInstance;

  const tableName = 'table-name';
  const teamId = 'teamId';
  const teamName = 'teamName';
  const image = 'image';
  const shortName = 'shortName';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
    dbQuerySpy = jest.spyOn(dynamoClient, 'query');
    dbUpdateSpy = jest.spyOn(dynamoClient, 'update');
    dbDeleteSpy = jest.spyOn(dynamoClient, 'delete');
    dbGetSpy = jest.spyOn(dynamoClient, 'get');

    service = teamDocumentServiceFactory(dynamoClient);

    process.env.DYNAMO_TABLE = tableName;
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('updateTeam', () => {
    const document = {
      teamName,
      image,
      shortName
    } as TeamDocumentUpdatable;
    it('should call dynamo.update with correct parameters', async () => {
      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve({});
        }
      });

      await service.updateTeam(teamId, document);
      expect(dbUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        ReturnValues: 'ALL_NEW',
        Key: {
          'documentType-id': `team-${teamId}`
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, orderingValue = :teamName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `team-${teamId}`,
          ':teamName': teamName,
          ':image': image,
          ':shortName': shortName
        }
      }));
    });

    it('should return the updated team', async () => {
      const updatedDocument = 'updatedTournament';

      dbUpdateSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Attributes: updatedDocument });
        }
      });

      const result = await service.updateTeam(teamId, document);
      expect(result).toEqual(updatedDocument);
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

      expect(dbQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'team',
        }
      }));
    });

    it('should return the queried teams', async () => {
      const teams = ['team1', 'team2', 'team3'];

      dbQuerySpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Items: teams });
        }
      });

      const result = await service.queryTeams();

      expect(result).toEqual(teams);
    });
  });

  describe('deleteTeam', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      dbDeleteSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.deleteTeam(teamId);
      expect(dbDeleteSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `team-${teamId}`,
        }
      }));
    });
  });

  describe('saveTeam', () => {
    it('should call dynamo.put with correct parameters', async () => {
      const document = {
        teamName,
        shortName,
        image
      } as TeamDocument;

      dbPutSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.saveTeam(document);
      expect(dbPutSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('queryTeamById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      dbGetSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Item: {} });
        }
      });

      await service.queryTeamById(teamId);

      expect(dbGetSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `team-${teamId}`,
        }
      }));
    });

    it('should return the queried team', async () => {
      const team = 'team';

      dbGetSpy.mockReturnValue({
        promise() {
          return Promise.resolve({ Item: team });
        }
      });

      const result = await service.queryTeamById(teamId);

      expect(result).toEqual(team);
    });
  });
});
