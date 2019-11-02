import { TournamentRequest } from '@/types/requests';
import { TournamentDocument, DocumentType } from '@/types/documents';
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
  const queryByKey = (partitionKey: string) => {
    return dynamoClient.query({
      TableName: process.env.DYNAMO_TABLE,
      KeyConditionExpression: '#documentTypeId = :pk',
      ExpressionAttributeNames: {
        '#documentTypeId': 'documentType-id'
      },
      ExpressionAttributeValues: {
        ':pk': partitionKey
      }
    }).promise();
  };

  const queryByDocumentType = (documentType: DocumentType) => {
    return dynamoClient.query({
      TableName: process.env.DYNAMO_TABLE,
      IndexName: 'indexByDocumentType',
      KeyConditionExpression: 'documentType = :documentType',
      ExpressionAttributeValues: {
        ':documentType': documentType,
      }
    }).promise();
  };

  return {
    saveTournament: (tournamentId, body) => {
      return dynamoClient.put(tournamentDocumentConverter.save(tournamentId, body)).promise();
    },
    updateTournament: (tournamentId, body) => {
      return dynamoClient.update(tournamentDocumentConverter.update(tournamentId, body)).promise();
    },
    queryTournamentById: async (tournamentId) => {
      return (await queryByKey(`tournament-${tournamentId}`)).Items[0] as TournamentDocument;
    },
    queryTournaments: async () => {
      return (await queryByDocumentType('tournament')).Items as TournamentDocument[];
    },
    deleteTournament: (tournamentId) => {
      return dynamoClient.delete(tournamentDocumentConverter.delete(tournamentId)).promise();
    },
  };
};
