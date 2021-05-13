import { BetDocument, MatchDocument, StandingDocument, TeamDocument, TournamentDocument, Document, DocumentType, DocumentKey, SettingKey, SettingDocument } from '@foci2020/shared/types/documents';
import { chunk, concatenate } from '@foci2020/shared/common/utils';
import { UserIdType, MatchIdType, TeamIdType, TournamentIdType, KeyType } from '@foci2020/shared/types/common';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

export interface IDatabaseService {
  saveBet(document: BetDocument): Promise<unknown>;
  saveMatch(document: MatchDocument): Promise<unknown>;
  saveStanding(document: StandingDocument): Promise<unknown>;
  saveTeam(document: TeamDocument): Promise<unknown>;
  saveTournament(document: TournamentDocument): Promise<unknown>;
  saveSetting(document: SettingDocument): Promise<unknown>;
  deleteBet(userId: UserIdType, matchId: MatchIdType): Promise<unknown>;
  deleteMatch(matchId: MatchIdType): Promise<unknown>;
  deleteTeam(teamId: TeamIdType): Promise<unknown>;
  deleteTournament(tournamentId: TournamentIdType): Promise<unknown>;
  getMatchById(matchId: MatchIdType): Promise<MatchDocument>;
  getTeamById(teamId: TeamIdType): Promise<TeamDocument>;
  getTournamentById(tournamentId: TournamentIdType): Promise<TournamentDocument>;
  getBetById(userId: UserIdType, matchId: MatchIdType): Promise<BetDocument>;
  getStandingById(tournamentId: TournamentIdType, userId: UserIdType): Promise<StandingDocument>;
  getSettingByKey(key: SettingKey): Promise<SettingDocument>;
  queryBetsByMatchId(matchId: MatchIdType): Promise<BetDocument[]>;
  queryBetsByTournamentIdUserId(tournamentId: TournamentIdType, userId: UserIdType): Promise<BetDocument[]>;
  queryMatchesByTournamentId(tournamentId: TournamentIdType): Promise<MatchDocument[]>;
  queryStandingsByTournamentId(tournamentId: TournamentIdType): Promise<StandingDocument[]>;
  queryMatchKeysByHomeTeamId(teamId: TeamIdType): Promise<DocumentKey[]>;
  queryMatchKeysByAwayTeamId(teamId: TeamIdType): Promise<DocumentKey[]>;
  listMatches(): Promise<MatchDocument[]>;
  listTeams(): Promise<TeamDocument[]>;
  listTournaments(): Promise<TournamentDocument[]>;
  updateBet(document: BetDocument): Promise<unknown>;
  updateMatch(document: MatchDocument): Promise<unknown>;
  updateTeamOfMatch(matchKey: KeyType, team: TeamDocument, type: 'home' | 'away'): Promise<unknown>;
  updateTournamentOfMatch(matchKey: KeyType, tournament: TournamentDocument): Promise<unknown>;
  updateTournament(document: TournamentDocument): Promise<unknown>;
  updateTeam(document: TeamDocument): Promise<unknown>;
  archiveDocument(document: Document): Promise<unknown>;
  deleteDocuments(keys: KeyType[]): Promise<unknown>;
  putDocuments(documents: Document[]): Promise<unknown>;
}

export const databaseServiceFactory = (config: {
  primaryTableName: string;
  archiveTableName: string;
}, dynamoClient: DocumentClient): IDatabaseService => {
  const saveDocument = <T extends Document>(document: T) => {
    return dynamoClient.put({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: config.primaryTableName,
      Item: document,
    }).promise();
  };

  const listDocuments = async <T extends Document>(documentType: T['documentType']) => {
    return (await dynamoClient.query({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: config.primaryTableName,
      IndexName: 'indexByDocumentType',
      KeyConditionExpression: 'documentType = :documentType',
      ExpressionAttributeValues: {
        ':documentType': documentType, 
      },
    }).promise()).Items as T[];
  };

  const updateDocument = async <T extends Document>(document: T) => {
    return dynamoClient.put({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: config.primaryTableName,
      Item: document,
      ConditionExpression: '#documentTypeId = :documentTypeId',
      ExpressionAttributeNames: {
        '#documentTypeId': 'documentType-id', 
      },
      ExpressionAttributeValues: {
        ':documentTypeId': document['documentType-id'], 
      },
    }).promise();
  };

  const deleteDocument = (documentId: string, documentType: DocumentType) => {
    return dynamoClient.delete({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: config.primaryTableName,
      Key: {
        'documentType-id': concatenate(documentType, documentId), 
      },
    }).promise();
  };

  const getDocumentById = async <T extends Document>(documentId: string, documentType: T['documentType']) => {
    return (await dynamoClient.get({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: config.primaryTableName,
      Key: {
        'documentType-id': concatenate(documentType, documentId), 
      },
    }).promise()).Item as T;
  };

  const queryDocumentsByMatchId = async <T extends Document>(matchId: string, documentType: T['documentType']) => {
    return (await dynamoClient.query({
      TableName: config.primaryTableName,
      IndexName: 'indexByMatchIdDocumentType',
      ReturnConsumedCapacity: 'INDEXES',
      KeyConditionExpression: '#matchIdDocumentType = :matchIdDocumentType',
      ExpressionAttributeNames: {
        '#matchIdDocumentType': 'matchId-documentType', 
      },
      ExpressionAttributeValues: {
        ':matchIdDocumentType': concatenate(matchId, documentType), 
      },
    }).promise()).Items as T[];
  };

  const queryDocumentsByTournamentId = async <T extends Document>(tournamentId: string, documentType: T['documentType'], isAscending = true) => {
    return (await dynamoClient.query({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: config.primaryTableName,
      IndexName: 'indexByTournamentIdDocumentType',
      KeyConditionExpression: '#tournamentIdDocumentType = :tournamentIdDocumentType',
      ScanIndexForward: isAscending,
      ExpressionAttributeNames: {
        '#tournamentIdDocumentType': 'tournamentId-documentType', 
      },
      ExpressionAttributeValues: {
        ':tournamentIdDocumentType': concatenate(tournamentId, documentType), 
      },
    }).promise()).Items as T[];
  };

  const queryDocumentsByTournamentIdUserId = async <T extends Document>(tournamentId: string, userId: string, documentType: T['documentType']) => {
    return (await dynamoClient.query({
      TableName: config.primaryTableName,
      IndexName: 'indexByTournamentIdUserIdDocumentType',
      ReturnConsumedCapacity: 'INDEXES',
      KeyConditionExpression: '#tournamentIdUserIdDocumentType = :tournamentIdUserIdDocumentType',
      ExpressionAttributeNames: {
        '#tournamentIdUserIdDocumentType': 'tournamentId-userId-documentType', 
      },
      ExpressionAttributeValues: {
        ':tournamentIdUserIdDocumentType': concatenate(tournamentId, userId, documentType), 
      },
    }).promise()).Items as T[];
  };

  const instance: IDatabaseService = {
    saveBet: document => saveDocument(document),
    saveMatch: document => saveDocument(document),
    saveStanding: document => saveDocument(document),
    saveTeam: document => saveDocument(document),
    saveTournament: document => saveDocument(document),
    saveSetting: document => saveDocument(document),
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
    getStandingById: (tournamentId, userId) => getDocumentById(concatenate(tournamentId, userId), 'standing'),
    getMatchById: matchId => getDocumentById(matchId, 'match'),
    getTeamById: teamId => getDocumentById(teamId, 'team'),
    getTournamentById: tournamentId => getDocumentById(tournamentId, 'tournament'),
    getSettingByKey: key => getDocumentById(key, 'setting'),
    queryBetsByMatchId: matchId => queryDocumentsByMatchId(matchId, 'bet'),
    queryBetsByTournamentIdUserId: (tournamentId, userId) => queryDocumentsByTournamentIdUserId(tournamentId, userId, 'bet'),
    queryMatchesByTournamentId: tournamentId => queryDocumentsByTournamentId(tournamentId, 'match'),
    queryStandingsByTournamentId: tournamentId => queryDocumentsByTournamentId(tournamentId, 'standing', false),
    updateTournamentOfMatch: (matchKey, tournament) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: config.primaryTableName,
        Key: {
          'documentType-id': matchKey, 
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set tournament = :tournament',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id', 
        },
        ExpressionAttributeValues: {
          ':documentTypeId': matchKey,
          ':tournament': tournament,
        },
      }).promise();
    },
    updateTeamOfMatch: (matchKey, team, type) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: config.primaryTableName,
        Key: {
          'documentType-id': matchKey, 
        },
        ConditionExpression: '#documentTypeId = :documentTypeId',
        UpdateExpression: 'set #team = :team',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
          '#team': `${type}Team`,
        },
        ExpressionAttributeValues: {
          ':documentTypeId': matchKey,
          ':team': team,
        },
      }).promise();
    },
    queryMatchKeysByHomeTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: config.primaryTableName,
        IndexName: 'indexByHomeTeamIdDocumentType',
        KeyConditionExpression: '#homeTeamIdDocumentType = :homeTeamIdDocumentType',
        ExpressionAttributeNames: {
          '#homeTeamIdDocumentType': 'homeTeamId-documentType', 
        },
        ExpressionAttributeValues: {
          ':homeTeamIdDocumentType': concatenate(teamId, 'match'), 
        },
      }).promise()).Items as DocumentKey[];
    },
    queryMatchKeysByAwayTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: config.primaryTableName,
        IndexName: 'indexByAwayTeamIdDocumentType',
        KeyConditionExpression: '#awayTeamIdDocumentType = :awayTeamIdDocumentType',
        ExpressionAttributeNames: {
          '#awayTeamIdDocumentType': 'awayTeamId-documentType', 
        },
        ExpressionAttributeValues: {
          ':awayTeamIdDocumentType': concatenate(teamId, 'match'), 
        },
      }).promise()).Items as DocumentKey[];
    },
    archiveDocument: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: config.archiveTableName,
        Item: document,
      }).promise();
    },
    deleteDocuments: async (keys) => {
      let unprocessItemCount = 0;
      for (const batch of chunk(keys, 25)) {
        const result = await dynamoClient.batchWrite({
          ReturnConsumedCapacity: 'INDEXES',
          RequestItems: {
            [config.primaryTableName]: batch.map(key => ({
              DeleteRequest: {
                Key: {
                  'documentType-id': key, 
                }, 
              }, 
            })), 
          },
        }).promise();
        unprocessItemCount += result.UnprocessedItems?.[config.primaryTableName]?.length;
      }

      if (unprocessItemCount > 0) {
        throw unprocessItemCount;
      }
    },
    putDocuments: async (documents) => {
      let unprocessItemCount = 0;
      for (const batch of chunk(documents, 25)) {
        const result = await dynamoClient.batchWrite({
          ReturnConsumedCapacity: 'INDEXES',
          RequestItems: {
            [config.primaryTableName]: batch.map(doc => ({
              PutRequest: {
                Item: doc, 
              }, 
            })), 
          },
        }).promise();
        unprocessItemCount += result.UnprocessedItems?.[config.primaryTableName]?.length;
      }

      if (unprocessItemCount > 0) {
        throw unprocessItemCount;
      }
    },
  };

  return instance;
};
