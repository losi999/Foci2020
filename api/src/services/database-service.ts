import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
}

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
  return {
    saveTeam: (team: TeamDocument) => {
      return dynamoClient.put({
        TableName: process.env.DYNAMO_TABLE,
        Item: team
      }).promise();
    }
  };
};
