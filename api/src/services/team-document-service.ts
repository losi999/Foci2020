import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types/types';

export interface ITeamDocumentService {
  saveTeam(document: TeamDocument): Promise<any>;
  updateTeam(teamId: string, document: TeamDocument): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTeams(): Promise<TeamDocument[]>;
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
    updateTeam: async (teamId, document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `team-${teamId}`,
        }
      }).promise();
    },
    queryTeamById: async (teamId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: teamTableName,
        Key: {
          'documentType-id': `team-${teamId}`
        },
      }).promise()).Item as TeamDocument;
    },
    queryTeams: async () => {
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
          'documentType-id': `team-${teamId}`,
        }
      }).promise();
    },
  };
};
