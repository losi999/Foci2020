import { MatchRequest } from '@/types/requests';
import {
  TeamDocument,
  TournamentDocument,
  DocumentKey,
  TournamentDetailsUpdateDocument,
  TeamDetailsUpdateDocument,
  MatchDocument,
  IndexByTournamentIdDocument,
  IndexByTeamIdDocument
} from '@/types/documents';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { DynamoDB } from 'aws-sdk';

export interface IMatchDocumentService {
  saveMatch(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): Promise<any>;
  updateMatch(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): Promise<any>;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentDetailsUpdateDocument): Promise<any>;
  updateMatchesWithTeam(matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[], team: TeamDetailsUpdateDocument): Promise<any>;
  queryMatchById(matchId: string): Promise<MatchDocument[]>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByTeamId(teamId: string): Promise<IndexByTeamIdDocument[]>;
  deleteMatch(matchId: string): Promise<any>;
}

export const matchDocumentServiceFactory = (
  dynamoClient: DynamoDB.DocumentClient,
  matchDocumentConverter: IMatchDocumentConverter
): IMatchDocumentService => {

  return {
    saveMatch: (matchId, body, homeTeam, awayTeam, tournament) => {
      return dynamoClient.transactWrite({
        TransactItems: matchDocumentConverter.save(matchId, body, homeTeam, awayTeam, tournament)
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
    queryMatchById: async (matchId) => {
      return (await dynamoClient.query({
        TableName: process.env.DYNAMO_TABLE,
        KeyConditionExpression: '#documentTypeId = :pk',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id'
        },
        ExpressionAttributeValues: {
          ':pk': `match-${matchId}`
        }
      }).promise()).Items as MatchDocument[];
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
  };
};
