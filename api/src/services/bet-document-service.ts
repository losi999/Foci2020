import { BetDocument } from '@/types/types';
import { DynamoDB } from 'aws-sdk';
import { concatenate } from '@/common';

export interface IBetDocumentService {
  queryBetById(userId: string, matchId: string): Promise<BetDocument>;
  queryBetsByMatchId(matchId: string): Promise<BetDocument[]>;
  queryBetsByTournamentIdUserId(tournamentId:string, userId: string): Promise<BetDocument[]>;
  saveBet(document: BetDocument): Promise<unknown>;
  updateBet(document: BetDocument): Promise<unknown>;
  deleteBet(betId: string): Promise<unknown>;
}

export const betDocumentServiceFactory = (
  betTableName: string,
  dynamoClient: DynamoDB.DocumentClient): IBetDocumentService => {
  return {
    queryBetById: async (userId, matchId) => {
      return (await dynamoClient.get({
        TableName: betTableName,
        ReturnConsumedCapacity: 'INDEXES',
        Key: {
          'documentType-id': concatenate('bet', userId, matchId)
        },
      }).promise()).Item as BetDocument;
    },
    queryBetsByMatchId: async (matchId) => {
      return (await dynamoClient.query({
        TableName: betTableName,
        IndexName: 'indexByMatchIdDocumentType',
        ReturnConsumedCapacity: 'INDEXES',
        KeyConditionExpression: '#matchIdDocumentType = :matchIdDocumentType',
        ExpressionAttributeNames: {
          '#matchIdDocumentType': 'matchId-documentType'
        },
        ExpressionAttributeValues: {
          ':matchIdDocumentType': concatenate(matchId, 'bet')
        }
      }).promise()).Items as BetDocument[];
    },
    queryBetsByTournamentIdUserId: async (tournamentId, userId) => {
      return (await dynamoClient.query({
        TableName: betTableName,
        IndexName: 'indexByTournamentIdUserIdDocumentType',
        ReturnConsumedCapacity: 'INDEXES',
        KeyConditionExpression: '#ournamentIdUserIdDocumentType = :ournamentIdUserIdDocumentType',
        ExpressionAttributeNames: {
          '#ournamentIdUserIdDocumentType': 'tournamentId-userId-documentType'
        },
        ExpressionAttributeValues: {
          ':ournamentIdUserIdDocumentType': concatenate(tournamentId, userId, 'bet')
        }
      }).promise()).Items as BetDocument[];
    },
    saveBet: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: betTableName,
        Item: document,
      }).promise();
    },
    updateBet: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: betTableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': document['documentType-id'],
        }
      }).promise();
    },
    deleteBet: (betId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: betTableName,
        Key: {
          'documentType-id': concatenate('bet', betId),
        }
      }).promise();
    }
  };
};
