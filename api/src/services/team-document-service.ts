import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types/types';
import { concatenate } from '@/common';

export interface ITeamDocumentService {
  saveTeam(document: TeamDocument): Promise<any>;
  updateTeam(document: TeamDocument): Promise<any>;
  getTeamById(teamId: string): Promise<TeamDocument>;
  listTeams(): Promise<TeamDocument[]>;
  deleteTeam(teamId: string): Promise<any>;
}

export const teamDocumentServiceFactory = (
  teamTableName: string,
  dynamoClient: DynamoDB.DocumentClient
): ITeamDocumentService => {

  return {
    saveTeam: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
        Item: document
      }).promise();
    },
    updateTeam: async (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
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
    getTeamById: async (teamId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
        Key: {
          'documentType-id': concatenate('team', teamId)
        },
      }).promise()).Item as TeamDocument;
    },
    listTeams: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'team',
        }
      }).promise()).Items as TeamDocument[];
    },
    deleteTeam: (teamId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
        Key: {
          'documentType-id': concatenate('team', teamId),
        }
      }).promise();
    },
  };
};
