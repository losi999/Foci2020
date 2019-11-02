import { DynamoDB } from 'aws-sdk';
import {
  TeamDocument,
  TournamentDocument,
  MatchDocument,
  DocumentKey,
  TournamentDetailsUpdateDocument,
  IndexByTournamentIdDocument,
  TeamDetailsUpdateDocument,
  IndexByTeamIdDocument,
  DocumentType
} from '@/types/documents';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { MatchRequest, TeamRequest, TournamentRequest } from '@/types/requests';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

export interface IDatabaseService {
  saveTeam(teamId: string, body: TeamRequest): Promise<any>;
  saveTournament(tournamentId: string, body: TournamentRequest): Promise<any>;
  saveMatch(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): Promise<any>;
  updateTournament(tournamentId: string, body: TournamentRequest): Promise<any>;
  updateTeam(teamId: string, body: TeamRequest): Promise<any>;
  updateMatch(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): Promise<any>;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentDetailsUpdateDocument): Promise<any>;
  updateMatchesWithTeam(matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[], team: TeamDetailsUpdateDocument): Promise<any>;
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

export const dynamoDatabaseService = (
  dynamoClient: DynamoDB.DocumentClient,
  matchDocumentConverter: IMatchDocumentConverter,
  teamDocumentConverter: ITeamDocumentConverter,
  tournamentDocumentConverter: ITournamentDocumentConverter
): IDatabaseService => {
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
    saveTeam: (teamId, body) => {
      return dynamoClient.put(teamDocumentConverter.save(teamId, body)).promise();
    },
    saveTournament: (tournamentId, body) => {
      return dynamoClient.put(tournamentDocumentConverter.save(tournamentId, body)).promise();
    },
    saveMatch: (matchId, body, homeTeam, awayTeam, tournament) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.save(matchId, body, homeTeam, awayTeam, tournament)
      }).promise();
    },
    updateTournament: (tournamentId, body) => {
      return dynamoClient.update(tournamentDocumentConverter.update(tournamentId, body)).promise();
    },
    updateTeam: (teamId, body) => {
      return dynamoClient.update(teamDocumentConverter.update(teamId, body)).promise();
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
      return dynamoClient.delete(teamDocumentConverter.delete(teamId)).promise();
    },
    deleteTournament: (tournamentId) => {
      return dynamoClient.delete(tournamentDocumentConverter.delete(tournamentId)).promise();
    },
  };
};
