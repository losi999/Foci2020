import { TournamentRequest } from '@/types/requests';
import { TournamentDocument } from '@/types/documents';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { DynamoDB } from 'aws-sdk';

export interface ITournamentDocumentService {
  saveTournament(tournamentId: string, body: TournamentRequest): Promise<any>;
  updateTournament(tournamentId: string, body: TournamentRequest): Promise<any>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryTournaments(): Promise<TournamentDocument[]>;
  deleteTournament(tournamentId: string): Promise<any>;
}

export const tournamentDocumentServiceFactory = (
  dynamoClient: DynamoDB.DocumentClient,
  tournamentDocumentConverter: ITournamentDocumentConverter
): ITournamentDocumentService => {
  return {
    saveTournament: (tournamentId, body) => {
      return dynamoClient.put(tournamentDocumentConverter.save(tournamentId, body)).promise();
    },
    updateTournament: (tournamentId, body) => {
      return dynamoClient.update(tournamentDocumentConverter.update(tournamentId, body)).promise();
    },
    queryTournamentById: async (tournamentId) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        KeyConditionExpression: '#documentTypeId = :pk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id'
        },
        ExpressionAttributeValues: {
          ':pk': `tournament-${tournamentId}`
        }
      }).promise()).Items[0] as TournamentDocument;
    },
    queryTournaments: async () => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament',
        }
      }).promise()).Items as TournamentDocument[];
    },
    deleteTournament: (tournamentId) => {
      return dynamoClient.delete(tournamentDocumentConverter.delete(tournamentId)).promise();
    },
  };
};
