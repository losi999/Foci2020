import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  MatchDocument,
  DocumentKey,
  TournamentUpdateDocument,
  IndexByTournamentIdDocument,
  TeamUpdateDocument,
  IndexByTeamIdDocument,
  DocumentType
} from '@/types/documents';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchRequest } from '@/types/requests';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
  saveTournament(tournament: TournamentDocument): Promise<any>;
  saveMatch(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): Promise<any>;
  updateTournament(key: DocumentKey, tournament: TournamentUpdateDocument): Promise<any>;
  updateTeam(key: DocumentKey, team: TeamUpdateDocument): Promise<any>;
  updateMatch(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): Promise<any>;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentUpdateDocument): Promise<any>;
  updateMatchesWithTeam(matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[], team: TeamUpdateDocument): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryMatchById(matchId: string): Promise<MatchDocument[]>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryTeams(): Promise<TeamDocument[]>;
  queryTournaments(): Promise<TournamentDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByTeamId(teamId: string): Promise<IndexByTeamIdDocument[]>;
  deleteMatch(matchId: string): Promise<any>;
  deleteTeam(teamId: string): Promise<any>;
  deleteTournament(tournamentId: string): Promise<any>;
}

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient, matchDocumentConverter: IMatchDocumentConverter): IDatabaseService => {
  const putDocument = (document: any) => {
    return dynamoClient.put({
      TableName: process.env.DYNAMO_TABLE,
      Item: document
    }).promise();
  };

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

  const deleteDocument = (partitionKey: string) => {
    return dynamoClient.delete({
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        segment: 'details',
        'documentType-id': partitionKey,
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
    saveTeam: (team) => {
      return putDocument(team);
    },
    saveTournament: (tournament) => {
      return putDocument(tournament);
    },
    saveMatch: (matchId, body, homeTeam, awayTeam, tournament) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.save(matchId, body, homeTeam, awayTeam, tournament)
      }).promise();
    },
    updateTournament: (key, { tournamentName }) => {
      return dynamoClient.update({
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': key['documentType-id'],
          segment: key.segment
        },
        ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#segment': 'segment'
        },
        ExpressionAttributeValues: {
          ':tournamentName': tournamentName
        }
      }).promise();
    },
    updateTeam: (key, { image, shortName, teamName }) => {
      return dynamoClient.update({
        TableName: process.env.DYNAMO_TABLE,
        Key: {
          'documentType-id': key['documentType-id'],
          segment: key.segment
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
      }).promise();
    },
    updateMatchesWithTournament: (matchKeys, tournament) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.updateMatchesWithTournament(matchKeys, tournament)
      }).promise();
    },
    updateMatchesWithTeam: (matchKeys, team) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.updateMatchesWithTeam(matchKeys, team)
      }).promise();
    },
    updateMatch: (matchId, body, homeTeam, awayTeam, tournament) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.update(matchId, body, homeTeam, awayTeam, tournament)
      }).promise();
    },
    queryTeamById: async (teamId) => {
      return (await queryByKey(`team-${teamId}`)).Items[0] as TeamDocument;
    },
    queryTournamentById: async (tournamentId) => {
      return (await queryByKey(`tournament-${tournamentId}`)).Items[0] as TournamentDocument;
    },
    queryMatchById: async (matchId) => {
      return (await queryByKey(`match-${matchId}`)).Items as MatchDocument[];
    },
    queryMatches: async (tournamentId) => {
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
    queryTeams: async () => {
      return (await queryByDocumentType('team')).Items as TeamDocument[];
    },
    queryTournaments: async () => {
      return (await queryByDocumentType('tournament')).Items as TournamentDocument[];
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
    },
    deleteMatch: (matchId) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.delete(matchId)
      }).promise();
    },
    deleteTeam: (teamId) => {
      return deleteDocument(`team-${teamId}`);
    },
    deleteTournament: (tournamentId) => {
      return deleteDocument(`tournament-${tournamentId}`);
    },
  };
};
