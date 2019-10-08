import { DynamoDB } from 'aws-sdk';
import { TeamDocument, TournamentDocument } from '@/types';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
  saveTournament(team: TournamentDocument): Promise<any>;
}

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
  return {
    saveTeam: (team: TeamDocument) => {
      return dynamoClient.put({
        TableName: process.env.DYNAMO_TABLE,
        Item: team
      }).promise();
    },
    saveTournament: (team: TournamentDocument) => {
      return dynamoClient.put({
        TableName: process.env.DYNAMO_TABLE,
        Item: team
      }).promise();
    }
  };
};
