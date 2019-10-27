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
  IndexByTeamIdDocument,
  MatchUpdateDocument,
  DocumentType
} from '@/types/documents';
import { TransactWriteItem, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

export interface IDatabaseService {
  saveTeam(team: TeamDocument): Promise<any>;
  saveTournament(tournament: TournamentDocument): Promise<any>;
  saveMatch(match: MatchSaveDocument): Promise<any>;
  updateTournament(key: DocumentKey, tournament: TournamentUpdateDocument): Promise<any>;
  updateTeam(key: DocumentKey, team: TeamUpdateDocument): Promise<any>;
  updateMatch(matchId: string, documents: MatchUpdateDocument): Promise<any>;
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

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
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
    updateMatchesWithTournament: (matchKeys, { tournamentName }) => {
      return dynamoClient.transactWrite({
        TransactItems: matchKeys.map(key => ({
          Update: {
            TableName: process.env.DYNAMO_TABLE,
            Key: {
              'documentType-id': key['documentType-id'],
              segment: key.segment
            },
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            UpdateExpression: 'set tournamentName = :tournamentName',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id',
              '#segment': 'segment'
            },
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
            TableName: process.env.DYNAMO_TABLE,
            Key: {
              'documentType-id': key['documentType-id'],
              segment: key.segment
            },
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName',
            ExpressionAttributeNames: {
              '#documentTypeId': 'documentType-id',
              '#segment': 'segment'
            },
            ExpressionAttributeValues: {
              ':teamName': teamName,
              ':image': image,
              ':shortName': shortName
            }
          }
        }))
      }).promise();
    },
    updateMatch: (matchId, [details, homeTeam, awayTeam, tournament]) => {
      return dynamoClient.transactWrite({
        TransactItems: [
          {
            Update: {
              TableName: process.env.DYNAMO_TABLE,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'details'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set startTime = :startTime, #group = :group, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#group': 'group',
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':startTime': details.startTime,
                ':group': details.group,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'details'
              }
            }
          },
          {
            Update: {
              TableName: process.env.DYNAMO_TABLE,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'homeTeam'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, teamId = :teamId, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':teamId': homeTeam.teamId,
                ':teamName': homeTeam.teamName,
                ':shortName': homeTeam.shortName,
                ':image': homeTeam.image,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'homeTeam'
              }
            }
          },
          {
            Update: {
              TableName: process.env.DYNAMO_TABLE,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'awayTeam'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set teamName = :teamName, image = :image, shortName = :shortName, teamId = :teamId, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':teamId': awayTeam.teamId,
                ':teamName': awayTeam.teamName,
                ':shortName': awayTeam.shortName,
                ':image': awayTeam.image,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'awayTeam'
              }
            }
          },
          {
            Update: {
              TableName: process.env.DYNAMO_TABLE,
              Key: {
                'documentType-id': `match-${matchId}`,
                segment: 'tournament'
              },
              ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
              UpdateExpression: 'set tournamentName = :tournamentName, tournamentId = :tournamentId, orderingValue = :orderingValue',
              ExpressionAttributeNames: {
                '#documentTypeId': 'documentType-id',
                '#segment': 'segment'
              },
              ExpressionAttributeValues: {
                ':tournamentId': tournament.tournamentId,
                ':tournamentName': tournament.tournamentName,
                ':orderingValue': `${tournament.tournamentId}-${details.startTime}`,
                ':documentTypeId': `match-${matchId}`,
                ':segment': 'tournament'
              }
            }
          }
        ]
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
      const matchSegments = ['details', 'homeTeam', 'awayTeam', 'tournament', 'finalScore'];
      return dynamoClient.transactWrite({
        TransactItems: matchSegments.map<TransactWriteItem>(segment => ({
          Delete: {
            TableName: process.env.DYNAMO_TABLE,
            Key: {
              segment,
              'documentType-id': `match-${matchId}`,
            } as DynamoDB.Key
          }
        }))
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
