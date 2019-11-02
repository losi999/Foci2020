import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@/converters/team-document-converter';
import { TeamResponse } from '@/types/responses';
import { TeamDocument, TeamDetailsDocument } from '@/types/documents';
import { TeamRequest } from '@/types/requests';
import { DynamoDB } from 'aws-sdk';

describe('Team document converter', () => {
  let converter: ITeamDocumentConverter;
  const teamId = 'teamId';
  const teamName = 'homeTeam';
  const shortName = 'HMT';
  const image = 'http://image.com/home.png';

  const tableName = 'tableName';
  beforeEach(() => {
    process.env.DYNAMO_TABLE = tableName;

    converter = teamDocumentConverterFactory();
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('createResponse', () => {
    let input: TeamDocument[];

    beforeEach(() => {
      input = [{
        shortName,
        teamName,
        image,
        teamId: 'teamId1',
      }, {
        shortName,
        teamName,
        image,
        teamId: 'teamId2',
      }] as TeamDocument[];
    });

    it('should convert documents to response', () => {
      const expectedResponse: TeamResponse[] = [
        {
          image,
          shortName,
          teamName,
          teamId: 'teamId1',
        },
        {
          image,
          shortName,
          teamName,
          teamId: 'teamId2',
        }
      ];
      const result = converter.createResponseList(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('save', () => {
    it('should return a put item', () => {
      const body = {
        image,
        shortName,
        teamName
      } as TeamRequest;

      const document: TeamDetailsDocument = {
        teamName,
        shortName,
        image,
        teamId,
        segment: 'details',
        documentType: 'team',
        'documentType-id': `team-${teamId}`,
        orderingValue: teamName
      };

      const expectedPut: DynamoDB.DocumentClient.Put = {
        TableName: tableName,
        Item: document
      };

      const result = converter.save(teamId, body);
      expect(result).toEqual(expectedPut);
    });
  });

  describe('update', () => {
    it('should return an update item', () => {
      const body = {
        image,
        shortName,
        teamName
      } as TeamRequest;

      const expectedItem: DynamoDB.DocumentClient.Update = {
        TableName: tableName,
        Key: {
          'documentType-id': teamId,
          segment: 'details'
        },
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
      };

      const result = converter.update(teamId, body);
      expect(result).toEqual(expectedItem);
    });
  });

  describe('delete', () => {
    it('should return a delete item', () => {

      const expectedItem: DynamoDB.DocumentClient.Delete = {
        TableName: tableName,
        Key: {
          segment: 'details',
          'documentType-id': `team-${teamId}`,
        }
      };

      const result = converter.delete(teamId);
      expect(result).toEqual(expectedItem);
    });
  });
});
