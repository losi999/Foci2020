import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@/converters/tournament-document-converter';
import { TournamentResponse } from '@/types/responses';
import { TournamentDocument, TournamentDetailsDocument } from '@/types/documents';
import { TournamentRequest } from '@/types/requests';
import { DynamoDB } from 'aws-sdk';

describe('Tournament document converter', () => {
  let converter: ITournamentDocumentConverter;
  const tournamentId = 'tournamentId';
  const tournamentName = 'tournament';

  const tableName = 'tableName';
  beforeEach(() => {
    process.env.DYNAMO_TABLE = tableName;

    converter = tournamentDocumentConverterFactory();
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('createResponse', () => {
    let input: TournamentDocument[];

    beforeEach(() => {
      input = [{
        tournamentName,
        tournamentId: 'tournamentId1',
      }, {
        tournamentName,
        tournamentId: 'tournamentId2',
      }] as TournamentDocument[];
    });

    it('should convert documents to response', () => {
      const expectedResponse: TournamentResponse[] = [
        {
          tournamentName,
          tournamentId: 'tournamentId1',
        },
        {
          tournamentName,
          tournamentId: 'tournamentId2',
        }
      ];
      const result = converter.createResponseList(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('save', () => {
    it('should return a put item', () => {
      const body = {
        tournamentName
      } as TournamentRequest;

      const document: TournamentDetailsDocument = {
        tournamentName,
        tournamentId,
        segment: 'details',
        documentType: 'tournament',
        'documentType-id': `tournament-${tournamentId}`,
        orderingValue: tournamentName
      };

      const expectedPut: DynamoDB.DocumentClient.Put = {
        TableName: tableName,
        Item: document
      };

      const result = converter.save(tournamentId, body);
      expect(result).toEqual(expectedPut);
    });
  });

  describe('update', () => {
    it('should return an update item', () => {
      const body = {
        tournamentName
      } as TournamentRequest;

      const expectedItem: DynamoDB.DocumentClient.Update = {
        TableName: tableName,
        Key: {
          'documentType-id': tournamentId,
          segment: 'details'
        },
        ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':tournamentName': tournamentName
        }
      };

      const result = converter.update(tournamentId, body);
      expect(result).toEqual(expectedItem);
    });
  });

  describe('delete', () => {
    it('should return a delete item', () => {

      const expectedItem: DynamoDB.DocumentClient.Delete = {
        TableName: tableName,
        Key: {
          segment: 'details',
          'documentType-id': `tournament-${tournamentId}`,
        }
      };

      const result = converter.delete(tournamentId);
      expect(result).toEqual(expectedItem);
    });
  });
});
