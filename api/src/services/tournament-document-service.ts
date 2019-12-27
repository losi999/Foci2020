import { TournamentDocument, TournamentDocumentUpdatable } from '@/types/documents';
import { DynamoDB } from 'aws-sdk';

export interface ITournamentDocumentService {
  saveTournament(document: TournamentDocument): Promise<any>;
  updateTournament(tournamentId: string, document: TournamentDocumentUpdatable): Promise<TournamentDocument>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryTournaments(): Promise<TournamentDocument[]>;
  deleteTournament(tournamentId: string): Promise<any>;
}

export const tournamentDocumentServiceFactory = (
  dynamoClient: DynamoDB.DocumentClient
): ITournamentDocumentService => {
  const capacity = (name: string) => (resp: any) => {
    console.log(`${name} CAPACITY`, JSON.stringify(resp.data.ConsumedCapacity));
  };

  return {
    saveTournament: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Item: document
      }).on('success', capacity('saveTournament')).promise();
    },
    updateTournament: async (tournamentId, { tournamentName }) => {
      return (await dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        ReturnValues: 'ALL_NEW',
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `tournament-${tournamentId}`,
          ':tournamentName': tournamentName
        }
      }).on('success', capacity('updateTournament')).promise()).Attributes as TournamentDocument;
    },
    queryTournamentById: async (tournamentId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        },
      }).on('success', capacity('queryTournamentById')).promise()).Item as TournamentDocument;
    },
    queryTournaments: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament',
        }
      }).on('success', capacity('queryTournaments')).promise()).Items as TournamentDocument[];
    },
    deleteTournament: (tournamentId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `tournament-${tournamentId}`,
        }
      }).on('success', capacity('deleteTournament')).promise();
    },
  };
};
