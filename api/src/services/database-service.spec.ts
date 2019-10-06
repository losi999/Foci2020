import { dynamoDatabaseService, IDatabaseService } from '@/services/database-service';
import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types';

describe('Database service', () => {
  let service: IDatabaseService;
  let dbPutSpy: jest.SpyInstance;
  const tableName = 'table-name';

  beforeEach(() => {
    const dynamoClient = new DynamoDB.DocumentClient();
    dbPutSpy = jest.spyOn(dynamoClient, 'put');
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
});
