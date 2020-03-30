import {
  BetDocument,
  MatchDocument,
  TournamentDocument,
  TeamDocument,
  StandingDocument,
  Document,
  DocumentType,
  IndexByHomeTeamIdDocument,
  IndexByAwayTeamIdDocument
} from '@/types/types';
import { DynamoDB } from 'aws-sdk';
import { concatenate } from '@/common';

export interface IDatabaseService {
  saveBet(document: BetDocument): Promise<unknown>;
  saveMatch(document: MatchDocument): Promise<unknown>;
  saveStanding(document: StandingDocument): Promise<unknown>;
  saveTeam(document: TeamDocument): Promise<unknown>;
  saveTournament(document: TournamentDocument): Promise<unknown>;
  deleteBet(userId: string, matchId: string): Promise<unknown>;
  deleteMatch(matchId: string): Promise<unknown>;
  deleteTeam(teamId: string): Promise<unknown>;
  deleteTournament(tournamentId: string): Promise<unknown>;
  getMatchById(matchId: string): Promise<MatchDocument>;
  getTeamById(teamId: string): Promise<TeamDocument>;
  getTournamentById(tournamentId: string): Promise<TournamentDocument>;
  getBetById(userId: string, matchId: string): Promise<BetDocument>;
  queryBetsByMatchId(matchId: string): Promise<BetDocument[]>;
  queryBetsByTournamentIdUserId(tournamentId: string, userId: string): Promise<BetDocument[]>;
  queryMatchesByTournamentId(tournamentId: string): Promise<MatchDocument[]>;
  queryStandingsByTournamentId(tournamentId: string): Promise<StandingDocument[]>;
  queryMatchKeysByHomeTeamId(teamId: string): Promise<IndexByHomeTeamIdDocument[]>;
  queryMatchKeysByAwayTeamId(teamId: string): Promise<IndexByAwayTeamIdDocument[]>;
  listMatches(): Promise<MatchDocument[]>;
  listTeams(): Promise<TeamDocument[]>;
  listTournaments(): Promise<TournamentDocument[]>;
  updateBet(document: BetDocument): Promise<unknown>;
  updateMatch(document: MatchDocument): Promise<unknown>;
  updateTeamOfMatch(matchId: string, team: TeamDocument, type: 'home' | 'away'): Promise<unknown>;
  updateTournamentOfMatch(matchId: string, tournament: TournamentDocument): Promise<unknown>;
  updateTournament(document: TournamentDocument): Promise<unknown>;
  updateTeam(document: TeamDocument): Promise<unknown>;
}

export const databaseServiceFactory = (tableName: string, dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
  const saveDocument = <T extends Document>(document: T) => {
    return dynamoClient.put({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: tableName,
      Item: document,
    }).promise();
  };

  const listDocuments = async <T extends Document>(documentType: T['documentType']) => {
    return (await dynamoClient.query({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: tableName,
      IndexName: 'indexByDocumentType',
      KeyConditionExpression: 'documentType = :documentType',
      ExpressionAttributeValues: {
        ':documentType': documentType,
      }
    }).promise()).Items as T[];
  };

  const updateDocument = async <T extends Document>(document: T) => {
    return dynamoClient.put({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: tableName,
      Item: document,
      ConditionExpression: '#documentTypeId = :documentTypeId',
      ExpressionAttributeNames: {
        '#documentTypeId': 'documentType-id',
      },
      ExpressionAttributeValues: {
        ':documentTypeId': document['documentType-id'],
      }
    }).promise();
  };

  const deleteDocument = (documentId: string, documentType: DocumentType) => {
    return dynamoClient.delete({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: tableName,
      Key: {
        'documentType-id': concatenate(documentType, documentId),
      }
    }).promise();
  };

  const getDocumentById = async <T extends Document>(documentId: string, documentType: T['documentType']) => {
    return (await dynamoClient.get({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: tableName,
      Key: {
        'documentType-id': concatenate(documentType, documentId)
      },
    }).promise()).Item as T;
  };

  const queryDocumentsByMatchId = async <T extends Document>(matchId: string, documentType: T['documentType']) => {
    return (await dynamoClient.query({
      TableName: tableName,
      IndexName: 'indexByMatchIdDocumentType',
      ReturnConsumedCapacity: 'INDEXES',
      KeyConditionExpression: '#matchIdDocumentType = :matchIdDocumentType',
      ExpressionAttributeNames: {
        '#matchIdDocumentType': 'matchId-documentType'
      },
      ExpressionAttributeValues: {
        ':matchIdDocumentType': concatenate(matchId, documentType)
      }
    }).promise()).Items as T[];
  };

  const queryDocumentsByTournamentId = async <T extends Document>(tournamentId: string, documentType: T['documentType'], isAscending = true) => {
    return (await dynamoClient.query({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: tableName,
      IndexName: 'indexByTournamentIdDocumentType',
      KeyConditionExpression: '#tournamentIdDocumentType = :tournamentIdDocumentType',
      ScanIndexForward: isAscending,
      ExpressionAttributeNames: {
        '#tournamentIdDocumentType': 'tournamentId-documentType'
      },
      ExpressionAttributeValues: {
        ':tournamentIdDocumentType': concatenate(tournamentId, documentType)
      }
    }).promise()).Items as T[];
  };

  const queryDocumentsByTournamentIdUserId = async <T extends Document>(tournamentId: string, userId: string, documentType: T['documentType']) => {
    return (await dynamoClient.query({
      TableName: tableName,
      IndexName: 'indexByTournamentIdUserIdDocumentType',
      ReturnConsumedCapacity: 'INDEXES',
      KeyConditionExpression: '#ournamentIdUserIdDocumentType = :ournamentIdUserIdDocumentType',
      ExpressionAttributeNames: {
        '#ournamentIdUserIdDocumentType': 'tournamentId-userId-documentType'
      },
      ExpressionAttributeValues: {
        ':ournamentIdUserIdDocumentType': concatenate(tournamentId, userId, documentType)
      }
    }).promise()).Items as T[];
  };

  const instance: IDatabaseService = {
    saveBet: document => saveDocument(document),
    saveMatch: document => saveDocument(document),
    saveStanding: document => saveDocument(document),
    saveTeam: document => saveDocument(document),
    saveTournament: document => saveDocument(document),
    listMatches: () => listDocuments('match'),
    listTeams: () => listDocuments('team'),
    listTournaments: () => listDocuments('tournament'),
    updateTournament: document => updateDocument(document),
    updateBet: document => updateDocument(document),
    updateMatch: document => updateDocument(document),
    updateTeam: document => updateDocument(document),
    deleteBet: (userId, matchId) => deleteDocument(concatenate(userId, matchId), 'bet'),
    deleteMatch: matchId => deleteDocument(matchId, 'match'),
    deleteTeam: teamId => deleteDocument(teamId, 'team'),
    deleteTournament: tournamentId => deleteDocument(tournamentId, 'tournament'),
    getBetById: (userId, matchId) => getDocumentById(concatenate(userId, matchId), 'bet'),
    getMatchById: matchId => getDocumentById(matchId, 'match'),
    getTeamById: teamId => getDocumentById(teamId, 'team'),
    getTournamentById: tournamentId => getDocumentById(tournamentId, 'tournament'),
    queryBetsByMatchId: matchId => queryDocumentsByMatchId(matchId, 'bet'),
    queryBetsByTournamentIdUserId: (tournamentId, userId) => queryDocumentsByTournamentIdUserId(tournamentId, userId, 'bet'),
    queryMatchesByTournamentId: tournamentId => queryDocumentsByTournamentId(tournamentId, 'match'),
    queryStandingsByTournamentId: tournamentId => queryDocumentsByTournamentId(tournamentId, 'standing', false),
    updateTournamentOfMatch: (matchId, tournament) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
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
        TableName: tableName,
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
    queryMatchKeysByHomeTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: tableName,
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
        TableName: tableName,
        IndexName: 'indexByAwayTeamIdDocumentType',
        KeyConditionExpression: '#awayTeamIdDocumentType = :awayTeamIdDocumentType',
        ExpressionAttributeNames: {
          '#awayTeamIdDocumentType': 'awayTeamId-documentType'
        },
        ExpressionAttributeValues: {
          ':awayTeamIdDocumentType': concatenate(teamId, 'match'),
        }
      }).promise()).Items as IndexByAwayTeamIdDocument[];
    },
  };

  return instance;
};
