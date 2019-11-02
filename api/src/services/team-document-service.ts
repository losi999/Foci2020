import { TeamRequest } from '@/types/requests';
import { TeamDocument, DocumentType } from '@/types/documents';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { DynamoDB } from 'aws-sdk';

export interface ITeamDocumentService {
  saveTeam(teamId: string, body: TeamRequest): Promise<any>;
  updateTeam(teamId: string, body: TeamRequest): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTeams(): Promise<TeamDocument[]>;
  deleteTeam(teamId: string): Promise<any>;
}

export const teamDocumentServiceFactory = (
  dynamoClient: DynamoDB.DocumentClient,
  teamDocumentConverter: ITeamDocumentConverter,
): ITeamDocumentService => {
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
    saveTeam: (teamId, body) => {
      return dynamoClient.put(teamDocumentConverter.save(teamId, body)).promise();
    },
    updateTeam: (teamId, body) => {
      return dynamoClient.update(teamDocumentConverter.update(teamId, body)).promise();
    },
    queryTeamById: async (teamId) => {
      return (await queryByKey(`team-${teamId}`)).Items[0] as TeamDocument;
    },
    queryTeams: async () => {
      return (await queryByDocumentType('team')).Items as TeamDocument[];
    },
    deleteTeam: (teamId) => {
      return dynamoClient.delete(teamDocumentConverter.delete(teamId)).promise();
    },
  };
};
