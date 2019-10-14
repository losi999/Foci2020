import { DynamoDB } from 'aws-sdk';
import { TeamDocument, TournamentDocument, MatchSaveDocument, MatchDocument } from '@/types';
import { TransactWriteItem, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
  saveTournament(team: TournamentDocument): Promise<any>;
  saveMatch(match: MatchSaveDocument): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryMatchesByDocumentType(): Promise<MatchDocument[]>;
  queryMatchesByTournamentId(tournamentId: string): Promise<MatchDocument[]>;
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
        Item: team,
      }).promise();
    },
    saveMatch: (match: MatchSaveDocument) => {
      return dynamoClient.transactWrite({
        TransactItems: match.map<TransactWriteItem>(m => ({
          Put: {
            TableName: process.env.DYNAMO_TABLE,
            Item: m as PutItemInputAttributeMap
          }
        }))
      }).promise();
    },
    queryTeamById: async (teamId: string) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        KeyConditionExpression: 'partitionKey = :pk and sortKey = :sk',
        ExpressionAttributeValues: {
          ':pk': `team-${teamId}`,
          ':sk': 'details'
        }
      }).promise()).Items[0] as TeamDocument;
    },
    queryTournamentById: async (tournamentId: string) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        KeyConditionExpression: 'partitionKey = :pk and sortKey = :sk',
        ExpressionAttributeValues: {
          ':pk': `tournament-${tournamentId}`,
          ':sk': 'details'
        }
      }).promise()).Items[0] as TournamentDocument;
    },
    queryMatchesByDocumentType: async () => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'match',
        }
      }).promise()).Items as MatchDocument[];
    },
    queryMatchesByTournamentId: async (tournamentId: string) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTournamentId',
        KeyConditionExpression: 'tournamentId = :tournamentId and  documentType = :documentType',
        ExpressionAttributeValues: {
          ':tournamentId': tournamentId,
          ':documentType': 'match',
        }
      }).promise()).Items as MatchDocument[];
    }
  };
};
