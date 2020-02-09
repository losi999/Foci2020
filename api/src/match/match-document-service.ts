import { DynamoDB } from 'aws-sdk';
import { chunk } from '@/shared/common';
import { MatchDocument, TournamentDocument, TeamDocument, IndexByTournamentIdDocument, IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/shared/types/types';

export interface IMatchDocumentService {
  saveMatch(document: MatchDocument): Promise<any>;
  updateMatch(matchId: string, document: MatchDocument): Promise<any>;
  updateTournamentOfMatches(matchIds: string[], tournament: TournamentDocument): Promise<any>;
  updateTeamOfMatches(matchId: string[], team: TeamDocument, type: 'home' | 'away'): Promise<any>;
  queryMatchById(matchId: string): Promise<MatchDocument>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByHomeTeamId(teamId: string): Promise<IndexByHomeTeamIdDocument[]>;
  queryMatchKeysByAwayTeamId(teamId: string): Promise<IndexByAwayTeamIdDocument[]>;
  deleteMatch(matchId: string): Promise<any>;
  deleteMatches(matchIds: string[]): Promise<any>;
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
    updateTournamentOfMatches: (matchIds, tournament) => {
      return Promise.all(chunk(matchIds, 20).map((ids) => {
        return dynamoClient.transactWrite({
          ReturnConsumedCapacity: 'INDEXES',
          TransactItems: ids.map<DynamoDB.DocumentClient.TransactWriteItem>((matchId) => {
            return {
              Update: {
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
              }
            };
          })
        }).promise();
      }));
    },
    updateTeamOfMatches: (matchIds, team, type) => {
      return Promise.all(chunk(matchIds, 20).map((ids) => {
        return dynamoClient.transactWrite({
          ReturnConsumedCapacity: 'INDEXES',
          TransactItems: ids.map<DynamoDB.DocumentClient.TransactWriteItem>((matchId) => {
            return {
              Update: {
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
              }
            };
          })
        }).promise();
      }));
    },
    updateMatch: (matchId, document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: matchTableName,
        Item: document,
        ConditionExpression: '#documentTypeId = :documentTypeId',
        ExpressionAttributeNames: {
          '#documentTypeId': 'documentType-id',
        },
        ExpressionAttributeValues: {
          ':documentTypeId': `match-${matchId}`,
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
    },
    deleteMatches: (matchIds) => {
      return Promise.all(chunk(matchIds, 20).map((ids) => {
        return dynamoClient.transactWrite({
          ReturnConsumedCapacity: 'INDEXES',
          TransactItems: ids.map<DynamoDB.DocumentClient.TransactWriteItem>((matchId) => {
            return {
              Delete: {
                TableName: matchTableName,
                Key: {
                  'documentType-id': `match-${matchId}`,
                },
                ConditionExpression: '#documentTypeId = :documentTypeId',
                ExpressionAttributeNames: {
                  '#documentTypeId': 'documentType-id',
                },
                ExpressionAttributeValues: {
                  ':documentTypeId': `match-${matchId}`,
                }
              }
            };
          })
        }).promise();
      }));
    }
  };
};
