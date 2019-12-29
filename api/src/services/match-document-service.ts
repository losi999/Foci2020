import {
  MatchDocument,
  IndexByTournamentIdDocument,
  MatchDocumentUpdatable,
  IndexByHomeTeamIdDocument,
  IndexByAwayTeamIdDocument,
  TournamentDocument,
  TeamDocument
} from '@/types/documents';
import { DynamoDB } from 'aws-sdk';

export interface IMatchDocumentService {
  saveMatch(document: MatchDocument): Promise<any>;
  updateMatch(matchId: string, document: MatchDocumentUpdatable): Promise<any>;
  updateMatchWithTournament(matchId: string, tournament: TournamentDocument): Promise<any>;
  updateMatchWithTeam(matchId: string, team: TeamDocument, type: 'home' | 'away'): Promise<any>;
  queryMatchById(matchId: string): Promise<MatchDocument>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByHomeTeamId(teamId: string): Promise<IndexByHomeTeamIdDocument[]>;
  queryMatchKeysByAwayTeamId(teamId: string): Promise<IndexByAwayTeamIdDocument[]>;
  deleteMatch(matchId: string): Promise<any>;
}

export const matchDocumentServiceFactory = (
  dynamoClient: DynamoDB.DocumentClient,
): IMatchDocumentService => {
  return {
    saveMatch: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Item: document
      }).promise();
    },
    updateMatchWithTournament: (matchId, tournament) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `match-${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournament = :tournament',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id'
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match-${matchId}`,
          ':tournament': tournament
        }
      }).promise();
    },
    updateMatchWithTeam: (matchId, team, type) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `match-${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: `set ${type}Team = :team`,
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match-${matchId}`,
          ':team': team,
        }
      }).promise();
    },
    updateMatch: (matchId, { startTime, group, homeTeam, awayTeam, awayTeamId, homeTeamId, tournament, tournamentId }) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `match-${matchId}`
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set startTime = :startTime, #group = :group, orderingValue = :orderingValue, homeTeamId = :homeTeamId, awayTeamId = :awayTeamId, tournamentId = :tournamentId, homeTeam = :homeTeam, awayTeam = :awayTeam, tournament = :tournament',
        ExpressionAttributeNames: {
          '#group': 'group',
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':startTime': startTime,
          ':group': group,
          ':orderingValue': `${tournamentId}-${startTime}`,
          ':documentTypeId': `match-${matchId}`,
          ':homeTeamId': homeTeamId,
          ':awayTeamId': awayTeamId,
          ':tournamentId': tournamentId,
          ':homeTeam': homeTeam,
          ':awayTeam': awayTeam,
          ':tournament': tournament
        }
      }).promise();
    },
    queryMatchById: async (matchId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `match-${matchId}`
        },
      }).promise()).Item as MatchDocument;
    },
    queryMatches: async (tournamentId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType and begins_with(orderingValue, :tournamentId)',
        ExpressionAttributeValues: {
          ':documentType': 'match',
          ':tournamentId': tournamentId
        }
      }).promise()).Items as MatchDocument[];
    },
    queryMatchKeysByTournamentId: async (tournamentId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTournamentId',
        KeyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: {
          ':tournamentId': tournamentId,
        }
      }).promise()).Items as IndexByTournamentIdDocument[];
    },
    queryMatchKeysByHomeTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByHomeTeamId',
        KeyConditionExpression: 'homeTeamId = :teamId',
        ExpressionAttributeValues: {
          ':teamId': teamId,
        }
      }).promise()).Items as IndexByHomeTeamIdDocument[];
    },
    queryMatchKeysByAwayTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByAwayTeamId',
        KeyConditionExpression: 'awayTeamId = :teamId',
        ExpressionAttributeValues: {
          ':teamId': teamId,
        }
      }).promise()).Items as IndexByAwayTeamIdDocument[];
    },
    deleteMatch: (matchId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': `match-${matchId}`,
        }
      }).promise();
    },
  };
};
