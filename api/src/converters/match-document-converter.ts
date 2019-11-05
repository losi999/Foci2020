import {
  MatchDocument,
  MatchDetailsDocument,
  MatchTeamDocument,
  MatchTeamUpdateDocument,
  MatchTournamentDocument,
  MatchFinalScoreDocument,
  TeamDocument,
  TournamentDocument,
  TeamDetailsUpdateDocument,
  DocumentKey,
  TournamentDetailsUpdateDocument
} from '@/types/documents';
import { MatchResponse } from '@/types/responses';
import { MatchRequest } from '@/types/requests';
import { DynamoDB } from 'aws-sdk';

type MatchCombinedById = {
  [matchId: string]: MatchCombined;
};

type MatchCombined = {
  details?: MatchDetailsDocument;
  homeTeam?: MatchTeamDocument;
  awayTeam?: MatchTeamUpdateDocument;
  tournament?: MatchTournamentDocument;
  finalScore?: MatchFinalScoreDocument;
};

export interface IMatchDocumentConverter {
  createResponse(documents: MatchDocument[]): MatchResponse;
  createResponseList(documents: MatchDocument[]): MatchResponse[];
  save(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): DynamoDB.DocumentClient.TransactWriteItemList;
  update(matchId: string, body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): DynamoDB.DocumentClient.TransactWriteItemList;
  delete(matchId: string): DynamoDB.DocumentClient.TransactWriteItemList;
  updateMatchesWithTeam(matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[], team: TeamDetailsUpdateDocument): DynamoDB.DocumentClient.TransactWriteItemList;
  updateMatchesWithTournament(matchKeys: DocumentKey<'tournament'>[], tournament: TournamentDetailsUpdateDocument): DynamoDB.DocumentClient.TransactWriteItemList;
}

export const matchDocumentConverterFactory = (): IMatchDocumentConverter => {
  const toRespose = ({ details, homeTeam, awayTeam, tournament, finalScore }: MatchCombined): MatchResponse => {
    return {
      matchId: details.matchId,
      group: details.group,
      startTime: details.startTime,
      homeTeam: {
        teamId: homeTeam.teamId,
        teamName: homeTeam.teamName,
        shortName: homeTeam.shortName,
        image: homeTeam.image,
      },
      awayTeam: {
        teamId: awayTeam.teamId,
        teamName: awayTeam.teamName,
        shortName: awayTeam.shortName,
        image: awayTeam.image,
      },
      tournament: {
        tournamentId: tournament.tournamentId,
        tournamentName: tournament.tournamentName,
      },
      finalScore: {
        homeScore: finalScore.homeScore,
        awayScore: finalScore.awayScore
      }
    };
  };

  const createResponseList = (documents: MatchDocument[]): MatchResponse[] => {
    const grouped = documents.reduce<MatchCombinedById>((accumulator, currentValue) => {
      const combined = accumulator[currentValue.matchId] || {};

      switch (currentValue.segment) {
        case 'details':
          return {
            ...accumulator,
            [currentValue.matchId]: {
              ...combined,
              details: currentValue,
            }
          };
        case 'homeTeam':
          return {
            ...accumulator,
            [currentValue.matchId]: {
              ...combined,
              homeTeam: currentValue
            },

          };
        case 'awayTeam':
          return {
            ...accumulator,
            [currentValue.matchId]: {
              ...combined,
              awayTeam: currentValue
            }
          };
        case 'tournament':
          return {
            ...accumulator,
            [currentValue.matchId]: {
              ...combined,
              tournament: currentValue
            }
          };
        case 'finalScore':
          return {
            ...accumulator,
            [currentValue.matchId]: {
              ...combined,
              finalScore: currentValue
            }
          };
      }
    }, {});

    return Object.values(grouped).map(combined => toRespose(combined));
  };

  return {
    createResponseList,
    createResponse: documents => createResponseList(documents).shift(),
    save: (matchId, body, homeTeam, awayTeam, tournament) => {
      const partitionKey = `match-${matchId}`;
      const orderingValue = `${body.tournamentId}-${body.startTime}`;
      const match: [MatchDetailsDocument, MatchTeamDocument, MatchTeamDocument, MatchTournamentDocument] = [
        {
          matchId,
          orderingValue,
          'documentType-id': partitionKey,
          segment: 'details',
          documentType: 'match',
          group: body.group,
          startTime: body.startTime,
        },
        {
          matchId,
          orderingValue,
          'documentType-id': partitionKey,
          segment: 'homeTeam',
          documentType: 'match',
          teamId: homeTeam.teamId,
          image: homeTeam.image,
          shortName: homeTeam.shortName,
          teamName: homeTeam.teamName
        },
        {
          matchId,
          orderingValue,
          'documentType-id': partitionKey,
          segment: 'awayTeam',
          documentType: 'match',
          teamId: awayTeam.teamId,
          image: awayTeam.image,
          shortName: awayTeam.shortName,
          teamName: awayTeam.teamName
        }, {
          matchId,
          orderingValue,
          'documentType-id': partitionKey,
          segment: 'tournament',
          documentType: 'match',
          tournamentId: tournament.tournamentId,
          tournamentName: tournament.tournamentName
        }
      ];

      return match.map<DynamoDB.DocumentClient.TransactWriteItem>(m => ({
        Put: {
          TableName: process.env.DYNAMO_TABLE,
          Item: m
        }
      }));
    },
    update: (matchId, body, homeTeam, awayTeam, tournament) => {
      return [
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
              ':startTime': body.startTime,
              ':group': body.group,
              ':orderingValue': `${tournament.tournamentId}-${body.startTime}`,
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
              ':orderingValue': `${tournament.tournamentId}-${body.startTime}`,
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
              ':orderingValue': `${tournament.tournamentId}-${body.startTime}`,
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
              ':orderingValue': `${tournament.tournamentId}-${body.startTime}`,
              ':documentTypeId': `match-${matchId}`,
              ':segment': 'tournament'
            }
          }
        }
      ];
    },
    delete: (matchId) => {
      const matchSegments = ['details', 'homeTeam', 'awayTeam', 'tournament', 'finalScore'];
      return matchSegments.map<DynamoDB.DocumentClient.TransactWriteItem>(segment => ({
        Delete: {
          TableName: process.env.DYNAMO_TABLE,
          Key: {
            segment,
            'documentType-id': `match-${matchId}`,
          }
        }
      }));
    },
    updateMatchesWithTeam: (matchKeys, { teamName, image, shortName }) => {
      return matchKeys.map<DynamoDB.DocumentClient.TransactWriteItem>(key => ({
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
      }));
    },
    updateMatchesWithTournament: (matchKeys, { tournamentName }) => {
      return matchKeys.map<DynamoDB.DocumentClient.TransactWriteItem>(key => ({
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
      }));
    }
  };
};
