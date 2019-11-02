import { TournamentDocument, TournamentDetailsDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { TournamentRequest } from '@/types/requests';
import { DynamoDB } from 'aws-sdk';

export interface ITournamentDocumentConverter {
  createResponse(document: TournamentDocument): TournamentResponse;
  createResponseList(documents: TournamentDocument[]): TournamentResponse[];
  save(tournamentId: string, body: TournamentRequest): DynamoDB.DocumentClient.Put;
  update(tournamentId: string, body: TournamentRequest): DynamoDB.DocumentClient.Update;
  delete(tournamentId: string): DynamoDB.DocumentClient.Delete;
}

export const tournamentDocumentConverterFactory = (): ITournamentDocumentConverter => {
  const createResponse = ({ tournamentId, tournamentName }: TournamentDocument): TournamentResponse => {
    return {
      tournamentName,
      tournamentId
    };
  };

  return {
    createResponse,
    createResponseList: (documents) => {
      return documents.map<TournamentResponse>(d => createResponse(d));
    },
    delete: (tournamentId) => {
      return {
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          segment: 'details',
          'documentType-id': `tournament-${tournamentId}`,
        }
      };
    },
    save: (tournamentId, { tournamentName }) => {
      const document: TournamentDetailsDocument = {
        tournamentId,
        tournamentName,
        segment: 'details',
        documentType: 'tournament',
        orderingValue: tournamentName,
        'documentType-id': `tournament-${tournamentId}`
      };

      return {
        TableName: process.env.DYNAMO_TABLE,
        Item: document
      };
    },
    update: (tournamentId, { tournamentName }) => {
      return {
        TableName: process.env.DYNAMO_TABLE,
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
    }
  };
};
