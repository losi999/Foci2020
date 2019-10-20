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
  updateTournament(key: DocumentKey, tournament: TournamentUpdateDocument): Promise<any>;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentUpdateDocument): Promise<any>;
  updateTeam(key: DocumentKey, team: TeamUpdateDocument): Promise<any>;
  updateMatchesWithTeam(matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[], team: TeamUpdateDocument): Promise<any>;
  updateMatch(matchId: string, documents: MatchUpdateDocument): Promise<any>;
  saveMatch(match: MatchSaveDocument): Promise<any>;
  queryTeamById(teamId: string): Promise<TeamDocument>;
  queryTournamentById(tournamentId: string): Promise<TournamentDocument>;
  queryMatches(tournamentId: string): Promise<MatchDocument[]>;
  queryTeams(): Promise<TeamDocument[]>;
  queryMatchKeysByTournamentId(tournamentId: string): Promise<IndexByTournamentIdDocument[]>;
  queryMatchKeysByTeamId(teamId: string): Promise<IndexByTeamIdDocument[]>;
}

export const dynamoDatabaseService = (dynamoClient: DynamoDB.DocumentClient): IDatabaseService => {
  const capacity = (name: string) => (resp: any) => {
    console.log(`${name} CAPACITY`, resp.data.ConsumedCapacity);
  };

  const putDocument = (document: any) => {
    return dynamoClient.put({
      ReturnConsumedCapacity: 'TOTAL',
      TableName: process.env.DYNAMO_TABLE,
      Item: document
    }).on('success', capacity('putDocument')).promise();
  };

  const queryByKey = async (partitionKey: string) => {
    return (await dynamoClient.query({
      ReturnConsumedCapacity: 'TOTAL',
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
    }).on('success', capacity('queryByKey')).promise()).Items[0];
  };

  return {
    saveTeam: team => putDocument(team),
    saveTournament: tournament => putDocument(tournament),
    updateTournament: (key, { tournamentName }) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'TOTAL',
        Key: {
          'documentType-id': key['documentType-id'],
          segment: key.segment
        },
        TableName: process.env.DYNAMO_TABLE,
        UpdateExpression: 'set tournamentName = :tournamentName, orderingValue = :tournamentName',
        ExpressionAttributeValues: {
          ':tournamentName': tournamentName
        }
      }).on('success', capacity('updateTournament')).promise();
    },
    updateTeam: (key, { image, shortName, teamName }) => {
      return dynamoClient.update({
        ReturnConsumedCapacity: 'TOTAL',
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
      }).on('success', capacity('updateTeam')).promise();
    },
    updateMatchesWithTournament: (matchKeys, { tournamentName }) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'TOTAL',
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
      }).on('success', capacity('updateMatchesWithTournament')).promise();
    },
    updateMatchesWithTeam: (matchKeys, { image, shortName, teamName }) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'TOTAL',
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
      }).on('success', capacity('updateMatchesWithTeam')).promise();
    },
    updateMatch: (matchId, [details, homeTeam, awayTeam, tournament]) => {
      return dynamoClient.transactWrite({
        ReturnConsumedCapacity: 'TOTAL',
        TransactItems: [{
          Update: {
            TableName: process.env.DYNAMO_TABLE,
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            Key: {
              'documentType-id': `match-${matchId}`,
              segment: 'details'
            },
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
        }, {
          Update: {
            TableName: process.env.DYNAMO_TABLE,
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            Key: {
              'documentType-id': `match-${matchId}`,
              segment: 'homeTeam'
            },
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
        }, {
          Update: {
            TableName: process.env.DYNAMO_TABLE,
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            Key: {
              'documentType-id': `match-${matchId}`,
              segment: 'awayTeam'
            },
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
        }, {
          Update: {
            TableName: process.env.DYNAMO_TABLE,
            ConditionExpression: '#documentTypeId = :documentTypeId and #segment = :segment',
            Key: {
              'documentType-id': `match-${matchId}`,
              segment: 'tournament'
            },
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
        ReturnConsumedCapacity: 'TOTAL',
        TransactItems: match.map<TransactWriteItem>(m => ({
          Put: {
            TableName: process.env.DYNAMO_TABLE,
            Item: m as PutItemInputAttributeMap
          }
        }))
      }).on('success', capacity('saveMatch')).promise();
    },
    queryTeamById: teamId => queryByKey(`team-${teamId}`) as Promise<TeamDocument>,
    queryTournamentById: tournamentId => queryByKey(`tournament-${tournamentId}`) as Promise<TournamentDocument>,
    queryMatches: async (tournamentId: string) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'TOTAL',
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
        ReturnConsumedCapacity: 'TOTAL',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByDocumentType',
        KeyConditionExpression: 'documentType = :documentType',
        ExpressionAttributeValues: {
          ':documentType': 'team',
        }
      }).on('success', capacity('queryMatches')).promise()).Items as TeamDocument[];
    },
    queryMatchKeysByTournamentId: async (tournamentId) => {
      return (await dynamoClient.query({
        ReturnConsumedCapacity: 'TOTAL',
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
        ReturnConsumedCapacity: 'TOTAL',
        TableName: process.env.DYNAMO_TABLE,
        IndexName: 'indexByTeamId',
        KeyConditionExpression: 'teamId = :teamId and documentType = :documentType',
        ExpressionAttributeValues: {
          ':teamId': teamId,
          ':documentType': 'match',
        }
      }).on('success', capacity('queryMatchKeysByTeamId')).promise()).Items as IndexByTeamIdDocument[];
    }
  };
};
