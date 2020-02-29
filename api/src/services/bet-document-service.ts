import { BetDocument } from '@/types/types';
import { DynamoDB } from 'aws-sdk';

export interface IBetDocumentService {
  queryBetById(userId: string, matchId: string): Promise<BetDocument>;
  queryBetsByMatchId(matchId: string): Promise<BetDocument[]>;
  saveBet(document: BetDocument): Promise<unknown>;
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
          'documentType-id': `bet-${userId}-${matchId}`
        },
      }).promise()).Item as BetDocument;
    },
    queryBetsByMatchId: async (matchId) => {
      return (await dynamoClient.query({
        TableName: betTableName,
        IndexName: 'indexByMatchId2',
        ReturnConsumedCapacity: 'INDEXES',
        KeyConditionExpression: 'matchId = :matchId',
        ExpressionAttributeValues: {
          ':matchId': matchId
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
    deleteBet: (betId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: betTableName,
        Key: {
          'documentType-id': `bet-${betId}`,
        }
      }).promise();
    }
  };
};
