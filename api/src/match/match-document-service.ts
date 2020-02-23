import { DynamoDB } from 'aws-sdk';
import { MatchDocument, TournamentDocument, TeamDocument, IndexByTournamentIdDocument, IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/shared/types/types';

export interface IMatchDocumentService {
  saveMatch(document: MatchDocument): Promise<unknown>;
  updateMatch(document: MatchDocument): Promise<unknown>;
  updateTournamentOfMatch(matchId: string, tournament: TournamentDocument): Promise<unknown>;
  updateTeamOfMatch(matchId: string, team: TeamDocument, type: 'home' | 'away'): Promise<unknown>;
  queryMatchById(matchId: string): Promise<MatchDocument>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByHomeTeamId(teamId: string): Promise<IndexByHomeTeamIdDocument[]>;
  queryMatchKeysByAwayTeamId(teamId: string): Promise<IndexByAwayTeamIdDocument[]>;
  deleteMatch(matchId: string): Promise<unknown>;
}

export const matchDocumentServiceFactory = (
  matchTableName: string,
  dynamoClient: DynamoDB.DocumentClient,
): IMatchDocumentService => {
  return {
    saveMatch: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Item: document
      }).promise();
    },
    updateTournamentOfMatch: (matchId, tournament) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
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
    updateTeamOfMatch: (matchId, team, type) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Key: {
          'documentType-id': `match-${matchId}`,
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set #team = :team',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#team': `${type}Team`
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match-${matchId}`,
          ':team': team,
        }
      }).promise();
    },
    updateMatch: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
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
    queryMatchById: async (matchId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Key: {
          'documentType-id': `match-${matchId}`
        },
      }).promise()).Item as MatchDocument;
    },
    queryMatches: async (tournamentId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
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
        TableName: matchTableName,
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
        TableName: matchTableName,
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
        TableName: matchTableName,
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
        TableName: matchTableName,
        Key: {
          'documentType-id': `match-${matchId}`,
        }
      }).promise();
    }
  };
};
