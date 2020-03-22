import { DynamoDB } from 'aws-sdk';
import { MatchDocument, TournamentDocument, TeamDocument, IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/types/types';
import { concatenate } from '@/common';

export interface IMatchDocumentService {
  saveMatch(document: MatchDocument): Promise<unknown>;
  updateMatch(document: MatchDocument): Promise<unknown>;
  updateTournamentOfMatch(matchId: string, tournament: TournamentDocument): Promise<unknown>;
  updateTeamOfMatch(matchId: string, team: TeamDocument, type: 'home' | 'away'): Promise<unknown>;
  getMatchById(matchId: string): Promise<MatchDocument>;
  listMatches(): Promise<MatchDocument[]>;
  queryMatchesByTournamentId(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByHomeTeamId(teamId: string): Promise<IndexByHomeTeamIdDocument[]>;
  queryMatchKeysByAwayTeamId(teamId: string): Promise<IndexByAwayTeamIdDocument[]>;
  deleteMatch(matchId: string): Promise<unknown>;
}

export const matchDocumentServiceFactory = (
  matchTableName: string,
  dynamoClient: DynamoDB.DocumentClient,
): IMatchDocumentService => {
  const instance: IMatchDocumentService = {
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
          'documentType-id': concatenate('match', matchId),
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournament = :tournament',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id'
        },
        ExpressionAttributeValues: {
          ':documentTypeId': concatenate('match', matchId),
          ':tournament': tournament
        }
      }).promise();
    },
    updateTeamOfMatch: (matchId, team, type) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Key: {
          'documentType-id': concatenate('match', matchId),
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set #team = :team',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#team': `${type}Team`
        },
        ExpressionAttributeValues: {
          ':documentTypeId': concatenate('match', matchId),
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
    getMatchById: async (matchId) => {
      return (await dynamoClient.get({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Key: {
          'documentType-id': concatenate('match', matchId)
        },
      }).promise()).Item as MatchDocument;
    },
    queryMatchesByTournamentId: async (tournamentId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        IndexName: 'indexByTournamentIdDocumentType',
        KeyConditionExpression: '#tournamentIdDocumentType = :tournamentIdDocumentType',
        ExpressionAttributeNames: {
          '#tournamentIdDocumentType': 'tournamentId-documentType'
        },
        ExpressionAttributeValues: {
          ':tournamentIdDocumentType': concatenate(tournamentId, 'match')
        }
      }).promise()).Items as MatchDocument[];
    },
    listMatches: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'match',
        }
      }).promise()).Items as MatchDocument[];
    },
    queryMatchKeysByHomeTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        IndexName: 'indexByHomeTeamIdDocumentType',
        KeyConditionExpression: '#homeTeamIdDocumentType = :homeTeamIdDocumentType',
        ExpressionAttributeNames: {
          '#homeTeamIdDocumentType': 'homeTeamId-documentType'
        },
        ExpressionAttributeValues: {
          ':homeTeamIdDocumentType': concatenate(teamId, 'match'),
        }
      }).promise()).Items as IndexByHomeTeamIdDocument[];
    },
    queryMatchKeysByAwayTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        IndexName: 'indexByHomeTeamIdDocumentType',
        KeyConditionExpression: '#awayTeamIdDocumentType = :awayTeamIdDocumentType',
        ExpressionAttributeNames:{
          '#awayTeamIdDocumentType': 'awayTeamId-documentType'
        },
        ExpressionAttributeValues: {
          ':awayTeamIdDocumentType': concatenate(teamId, 'match'),
        }
      }).promise()).Items as IndexByAwayTeamIdDocument[];
    },
    deleteMatch: (matchId) => {
      return dynamoClient.delete({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Key: {
          'documentType-id': concatenate('match', matchId),
        }
      }).promise();
    }
  };

  return instance;
};
