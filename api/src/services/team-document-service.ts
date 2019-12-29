import { TeamDocument, TeamDocumentUpdatable } from '@/types/documents';
import { DynamoDB } from 'aws-sdk';

export interface ITeamDocumentService {
  saveTeam(document: TeamDocument): Promise<any>;
  updateTeam(teamId: string, document: TeamDocumentUpdatable): Promise<TeamDocument>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTeams(): Promise<TeamDocument[]>;
  deleteTeam(teamId: string): Promise<any>;
}

export const teamDocumentServiceFactory = (
  dynamoClient: DynamoDB.DocumentClient
): ITeamDocumentService => {

  return {
    saveTeam: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Item: document
      }).promise();
    },
    updateTeam: async (teamId, { image, shortName, teamName }) => {
      return (await dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        ReturnValues: 'ALL_NEW',
        Key: {
          'documentType-id': `team-${teamId}`
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, orderingValue = :teamName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `team-${teamId}`,
          ':teamName': teamName,
          ':image': image,
          ':shortName': shortName
        }
      }).promise()).Attributes as TeamDocument;
    },
    queryTeamById: async (teamId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `team-${teamId}`
        },
      }).promise()).Item as TeamDocument;
    },
    queryTeams: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
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
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `team-${teamId}`,
        }
      }).promise();
    },
  };
};
