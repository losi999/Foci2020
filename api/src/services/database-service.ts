import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  MatchSaveDocument,
  MatchDocument,
  DocumentKey,
  TournamentUpdateDocument,
  IndexByTournamentIdDocument
} from '@/types/documents';
import { TransactWriteItem, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
  saveTournament(tournament: TournamentDocument): Promise<any>;
  updateTournament(key: DocumentKey, tournament: TournamentUpdateDocument): Promise<any>;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentUpdateDocument): Promise<any>;
  saveMatch(match: MatchSaveDocument): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
}

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
  return {
    saveTeam: (team) => {
      return dynamoClient.put({
        TableName: process.env.DYNAMO_TABLE,
        Item: team
      }).promise();
    },
    saveTournament: (tournament) => {
      return dynamoClient.put({
        TableName: process.env.DYNAMO_TABLE,
        Item: tournament,
      }).promise();
    },
    updateTournament: (key, { tournamentName }) => {
      return dynamoClient.update({
        Key: {
          'documentType-id': key['documentType-id'],
          segment: key.segment
        },
        TableName: process.env.DYNAMO_TABLE,
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeValues: {
          ':tournamentName': tournamentName
        }
      }).promise();
    },
    updateMatchesWithTournament: (matchKeys, { tournamentName }) => {
      return dynamoClient.transactWrite({
        TransactItems: matchKeys.map(key => ({
          Update: {
            Key: {
              'documentType-id': key['documentType-id'],
              segment: key.segment
            },
            TableName: process.env.DYNAMO_TABLE,
            UpdateExpression: 'set tournamentName = :tournamentName',
            ExpressionAttributeValues: {
              ':tournamentName': tournamentName
            }
          }
        }))
      }).promise();
    },
    saveMatch: (match) => {
      return dynamoClient.transactWrite({
        TransactItems: match.map<TransactWriteItem>(m => ({
          Put: {
            TableName: process.env.DYNAMO_TABLE,
            Item: m as PutItemInputAttributeMap
          }
        }))
      }).promise();
    },
    queryTeamById: async (teamId) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        KeyConditionExpression: '#documentTypeId = :pk and #segment = :sk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':pk': `team-${teamId}`,
          ':sk': 'details'
        }
      }).promise()).Items[0] as TeamDocument;
    },
    queryTournamentById: async (tournamentId) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        KeyConditionExpression: '#documentTypeId = :pk and #segment = :sk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':pk': `tournament-${tournamentId}`,
          ':sk': 'details'
        }
      }).promise()).Items[0] as TournamentDocument;
    },
    queryMatches: async (tournamentId: string) => {
      return (await dynamoClient.query({
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
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTournamentId',
        KeyConditionExpression: 'tournamentId = :tournamentId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':tournamentId': tournamentId,
          ':documentType': 'match',
        }
      }).promise()).Items as IndexByTournamentIdDocument[];
    }
  };
};
