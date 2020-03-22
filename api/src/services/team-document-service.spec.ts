import { ITeamDocumentService, teamDocumentServiceFactory } from '@/services/team-document-service';
import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types/types';
import { Mock, createMockService, awsResolvedValue } from '@/common/unit-testing';

describe('Team document service', () => {
  let service: ITeamDocumentService;
  let mockDynamoClient: Mock<DynamoDB.DocumentClient>;

  const tableName = 'table-name';
  const teamId = 'teamId';
  const teamName = 'teamName';
  const image = 'image';
  const shortName = 'shortName';

  beforeEach(() => {
    mockDynamoClient = createMockService('put', 'query', 'get', 'delete');

    service = teamDocumentServiceFactory(tableName, mockDynamoClient.service);
  });

  describe('updateTeam', () => {
    const documentTypeId = 'team-id1';
    const document = {
      teamName,
      image,
      shortName,
      'documentType-id': documentTypeId
    } as TeamDocument;
    it('should call dynamo.update with correct parameters', async () => {
      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue());

      await service.updateTeam(document);
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

  describe('queryTeams', () => {
    it('should call dynamo.query with correct parameters', async () => {
      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: [] }));

      await service.listTeams();

      expect(mockDynamoClient.functions.query).toHaveBeenCalledWith(expect.objectContaining({
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

      mockDynamoClient.functions.query.mockReturnValue(awsResolvedValue({ Items: teams }));

      const result = await service.listTeams();

      expect(result).toEqual(teams);
    });
  });

  describe('deleteTeam', () => {
    it('should call dynamo.delete with correct parameters', async () => {
      mockDynamoClient.functions.delete.mockReturnValue(awsResolvedValue(undefined));

      await service.deleteTeam(teamId);
      expect(mockDynamoClient.functions.delete).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `team#${teamId}`,
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

      mockDynamoClient.functions.put.mockReturnValue(awsResolvedValue(undefined));

      await service.saveTeam(document);
      expect(mockDynamoClient.functions.put).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Item: document
      }));
    });
  });

  describe('queryTeamById', () => {
    it('should call dynamo.get with correct parameters', async () => {
      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: {} }));

      await service.getTeamById(teamId);

      expect(mockDynamoClient.functions.get).toHaveBeenCalledWith(expect.objectContaining({
        TableName: tableName,
        Key: {
          'documentType-id': `team#${teamId}`,
        }
      }));
    });

    it('should return the queried team', async () => {
      const team = 'team';

      mockDynamoClient.functions.get.mockReturnValue(awsResolvedValue({ Item: team }));

      const result = await service.getTeamById(teamId);

      expect(result).toEqual(team);
    });
  });
});
