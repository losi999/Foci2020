import { TeamDocument, TeamDetailsDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';
import { TeamRequest } from '@/types/requests';
import { DynamoDB } from 'aws-sdk';

export interface ITeamDocumentConverter {
  createResponse(document: TeamDocument): TeamResponse;
  createResponseList(documents: TeamDocument[]): TeamResponse[];
  save(teamId: string, body: TeamRequest): DynamoDB.DocumentClient.Put;
  update(teamId: string, body: TeamRequest): DynamoDB.DocumentClient.Update;
  delete(teamId: string): DynamoDB.DocumentClient.Delete;
}

export const teamDocumentConverterFactory = (): ITeamDocumentConverter => {
  const createResponse = ({ shortName, teamId, teamName, image }: TeamDocument): TeamResponse => {
    return {
      image,
      teamName,
      teamId,
      shortName
    };
  };

  return {
    createResponse,
    createResponseList: (documents) => {
      return documents.map<TeamResponse>(d => createResponse(d));
    },
    delete: (teamId) => {
      return {
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          segment: 'details',
          'documentType-id': `team-${teamId}`,
        }
      };
    },
    save: (teamId, { image, shortName, teamName }) => {
      const document: TeamDetailsDocument = {
        image,
        shortName,
        teamName,
        teamId,
        segment: 'details',
        documentType: 'team',
        orderingValue: teamName,
        'documentType-id': `team-${teamId}`
      };

      return {
        TableName: process.env.DYNAMO_TABLE,
        Item: document
      };
    },
    update: (teamId, { image, shortName, teamName }) => {
      return {
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': teamId,
          segment: 'details'
        },
        ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
        UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, orderingValue = :teamName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':teamName': teamName,
          ':image': image,
          ':shortName': shortName
        }
      };
    }
  };
};
