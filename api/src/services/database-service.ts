import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  MatchSaveDocument,
  MatchDocument,
  DocumentKey,
  TournamentUpdateDocument,
  IndexByTournamentIdDocument,
  TeamUpdateDocument,
  IndexByTeamIdDocument
} from '@/types/documents';
import { TransactWriteItem, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
  saveTournament(tournament: TournamentDocument): Promise<any>;
  updateTournament(key: DocumentKey, tournament: TournamentUpdateDocument): Promise<any>;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentUpdateDocument): Promise<any>;
  updateTeam(key: DocumentKey, team: TeamUpdateDocument): Promise<any>;
  updateMatchesWithTeam(matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[], team: TeamUpdateDocument): Promise<any>;
  saveMatch(match: MatchSaveDocument): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByTeamId(teamId: string): Promise<IndexByTeamIdDocument[]>;
}

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
  const putDocument = (document: any) => {
    return dynamoClient.put({
      TableName: process.env.DYNAMO_TABLE,
      Item: document
    }).promise();
  };

  const queryByKey = async (partitionKey: string) => {
    return (await dynamoClient.query({
      TableName: process.env.DYNAMO_TABLE,
      KeyConditionExpression: '#documentTypeId = :pk and #segment = :sk',
      ExpressionAttributeNames: {
        '#documentTypeId': 'documentType-id',
        '#segment': 'segment'
      },
      ExpressionAttributeValues: {
        ':pk': partitionKey,
        ':sk': 'details'
      }
    }).promise()).Items[0];
  };

  return {
    saveTeam: team => putDocument(team),
    saveTournament: tournament => putDocument(tournament),
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
    updateTeam: (key, { image, shortName, teamName }) => {
      return dynamoClient.update({
        Key: {
          'documentType-id': key['documentType-id'],
          segment: key.segment
        },
        TableName: process.env.DYNAMO_TABLE,
        UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, orderingValue = :teamName ',
        ExpressionAttributeValues: {
          ':teamName': teamName,
          ':image': image,
          ':shortName': shortName
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
    updateMatchesWithTeam: (matchKeys, { image, shortName, teamName }) => {
      return dynamoClient.transactWrite({
        TransactItems: matchKeys.map(key => ({
          Update: {
            Key: {
              'documentType-id': key['documentType-id'],
              segment: key.segment
            },
            TableName: process.env.DYNAMO_TABLE,
            UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName',
            ExpressionAttributeValues: {
              ':teamName': teamName,
              ':image': image,
              ':shortName': shortName
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
    queryTeamById: teamId => queryByKey(`team-${teamId}`) as Promise<TeamDocument>,
    queryTournamentById: tournamentId => queryByKey(`tournament-${tournamentId}`) as Promise<TournamentDocument>,
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
    },
    queryMatchKeysByTeamId: async (teamId) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTeamId',
        KeyConditionExpression: 'teamId = :teamId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':teamId': teamId,
          ':documentType': 'match',
        }
      }).promise()).Items as IndexByTeamIdDocument[];
    }
  };
};
