import { DynamoDB } from 'aws-sdk';
import { TournamentDocument } from '@/types/types';
import { concatenate } from '@/common';

export interface ITournamentDocumentService {
  saveTournament(document: TournamentDocument): Promise<any>;
  updateTournament(document: TournamentDocument): Promise<any>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryTournaments(): Promise<TournamentDocument[]>;
  deleteTournament(tournamentId: string): Promise<any>;
}

export const tournamentDocumentServiceFactory = (
  tournamentTableName: string,
  dynamoClient: DynamoDB.DocumentClient
): ITournamentDocumentService => {

  return {
    saveTournament: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tournamentTableName,
        Item: document
      }).promise();
    },
    updateTournament: async (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tournamentTableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': document['documentType-id'],
        },
      }).promise();
    },
    queryTournamentById: async (tournamentId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tournamentTableName,
        Key: {
          'documentType-id': concatenate('tournament', tournamentId),
        },
      }).promise()).Item as TournamentDocument;
    },
    queryTournaments: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tournamentTableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament',
        }
      }).promise()).Items as TournamentDocument[];
    },
    deleteTournament: (tournamentId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tournamentTableName,
        Key: {
          'documentType-id': concatenate('tournament', tournamentId),
        }
      }).promise();
    },
  };
};
