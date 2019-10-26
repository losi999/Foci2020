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
  MatchUpdateDocument
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
  const capacity = (name: string) => (resp: any) => {
    console.log(`${name} CAPACITY`, JSON.stringify(resp.data.ConsumedCapacity));
  };

  const putDocument = (document: any) => {
    return dynamoClient.put({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: process.env.DYNAMO_TABLE,
      Item: document
    }).on('success', capacity('putDocument')).promise();
  };

  const queryByKey = (partitionKey: string) => {
    return dynamoClient.query({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: process.env.DYNAMO_TABLE,
      KeyConditionExpression: '#documentTypeId = :pk',
      ExpressionAttributeNames: {
        '#documentTypeId': 'documentType-id'
      },
      ExpressionAttributeValues: {
        ':pk': partitionKey
      }
    }).on('success', capacity('queryByKey')).promise();
  };

  const deleteDocument = (partitionKey: string) => {
    return dynamoClient.delete({
      ReturnConsumedCapacity: 'INDEXES',
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        segment: 'details',
        'documentType-id': partitionKey,
      }
    }).on('success', capacity('deleteDocument')).promise();
  };

  return {
    saveTeam: team => putDocument(team),
    saveTournament: tournament => putDocument(tournament),
    updateTournament: (key, { tournamentName }) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
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
      }).on('success', capacity('updateTournament')).promise();
    },
    updateTeam: (key, { image, shortName, teamName }) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'INDEXES',
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
      }).on('success', capacity('updateTeam')).promise();
    },
    updateMatchesWithTournament: (matchKeys, { tournamentName }) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'INDEXES',
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
      }).on('success', capacity('updateMatchesWithTournament')).promise();
    },
    updateMatchesWithTeam: (matchKeys, { image, shortName, teamName }) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'INDEXES',
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
      }).on('success', capacity('updateMatchesWithTeam')).promise();
    },
    updateMatch: (matchId, [details, homeTeam, awayTeam, tournament]) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'INDEXES',
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
      }).on('success', capacity('updateMatch')).promise();
    },
    saveMatch: (match) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'INDEXES',
        TransactItems: match.map<TransactWriteItem>(m => ({
          Put: {
            TableName: process.env.DYNAMO_TABLE,
            Item: m as PutItemInputAttributeMap
          }
        }))
      }).on('success', capacity('saveMatch')).promise();
    },
    queryTeamById: async teamId => (await queryByKey(`team-${teamId}`)).Items[0] as TeamDocument,
    queryTournamentById: async tournamentId => (await queryByKey(`tournament-${tournamentId}`)).Items[0] as TournamentDocument,
    queryMatchById: async matchId => (await queryByKey(`match-${matchId}`)).Items as MatchDocument[],
    queryMatches: async (tournamentId: string) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType and begins_with(orderingValue, :tournamentId)',
        ExpressionAttributeValues: {
          ':documentType': 'match',
          ':tournamentId': tournamentId
        }
      }).on('success', capacity('queryMatches')).promise()).Items as MatchDocument[];
    },
    queryTeams: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'team',
        }
      }).on('success', capacity('queryTeams')).promise()).Items as TeamDocument[];
    },
    queryTournaments: async () => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'tournament',
        }
      }).on('success', capacity('queryTournaments')).promise()).Items as TournamentDocument[];
    },
    queryMatchKeysByTournamentId: async (tournamentId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTournamentId',
        KeyConditionExpression: 'tournamentId = :tournamentId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':tournamentId': tournamentId,
          ':documentType': 'match',
        }
      }).on('success', capacity('queryMatchKeysByTournamentId')).promise()).Items as IndexByTournamentIdDocument[];
    },
    queryMatchKeysByTeamId: async (teamId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTeamId',
        KeyConditionExpression: 'teamId = :teamId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':teamId': teamId,
          ':documentType': 'match',
        }
      }).on('success', capacity('queryMatchKeysByTeamId')).promise()).Items as IndexByTeamIdDocument[];
    },
    deleteMatch: (matchId) => {
      const matchSegments = ['details', 'homeTeam', 'awayTeam', 'tournament', 'finalScore'];
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'INDEXES',
        TransactItems: matchSegments.map<TransactWriteItem>(segment => ({
          Delete: {
            TableName: process.env.DYNAMO_TABLE,
            Key: {
              segment,
              'documentType-id': `match-${matchId}`,
            } as DynamoDB.Key
          }
        }))
      }).on('success', capacity('deleteMatch')).promise();
    },
    deleteTeam: teamId => deleteDocument(`team-${teamId}`),
    deleteTournament: tournamentId => deleteDocument(`tournament-${tournamentId}`),
  };
};
