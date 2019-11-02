import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@/converters/match-document-converter';
import { MatchResponse } from '@/types/responses';
import { MatchDocument, TeamDocument, TournamentDocument, MatchDetailsDocument, MatchTeamDocument, MatchTournamentDocument, DocumentKey } from '@/types/documents';
import { MatchRequest } from '@/types/requests';
import { DynamoDB } from 'aws-sdk';

describe('Match document converter', () => {
  let converter: IMatchDocumentConverter;
  const matchId = 'matchId';
  const group = 'group';
  const homeTeamName = 'homeTeam';
  const homeTeamId = 'homeTeamId';
  const homeTeamShortName = 'HMT';
  const homeTeamImage = 'http://image.com/home.png';
  const awayTeamName = 'awayTeam';
  const awayTeamId = 'awayTeamId';
  const awayTeamShortName = 'AWT';
  const awayTeamImage = 'http://image.com/away.png';
  const tournamentName = 'tournamentName';
  const tournamentId = 'tournamentId';
  const startTime = 'start';

  const tableName = 'tableName';
  beforeEach(() => {
    process.env.DYNAMO_TABLE = tableName;

    converter = matchDocumentConverterFactory();
  });

  afterEach(() => {
    process.env.DYNAMO_TABLE = undefined;
  });

  describe('createResponse', () => {
    let input: MatchDocument[];

    const homeScore = 1;
    const awayScore = 2;
    beforeEach(() => {
      input = [{
        matchId,
        group,
        startTime,
        segment: 'details',
      }, {
        matchId,
        segment: 'homeTeam',
        teamName: homeTeamName,
        teamId: homeTeamId,
        shortName: homeTeamShortName,
        image: homeTeamImage
      }, {
        matchId,
        segment: 'awayTeam',
        teamName: awayTeamName,
        teamId: awayTeamId,
        shortName: awayTeamShortName,
        image: awayTeamImage
      }, {
        matchId,
        tournamentName,
        tournamentId,
        segment: 'tournament',
      }, {
        matchId,
        homeScore,
        awayScore,
        segment: 'finalScore',
      }] as MatchDocument[];
    });

    it('should convert documents to response', () => {
      const expectedResponse: MatchResponse = {
        matchId,
        group,
        startTime,
        tournament: {
          tournamentId,
          tournamentName
        },
        homeTeam: {
          teamName: homeTeamName,
          teamId: homeTeamId,
          shortName: homeTeamShortName,
          image: homeTeamImage
        },
        awayTeam: {
          teamName: awayTeamName,
          teamId: awayTeamId,
          shortName: awayTeamShortName,
          image: awayTeamImage
        },
        finalScore: {
          homeScore,
          awayScore
        }
      };
      const result = converter.createResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('save', () => {
    it('should return a list of transact write items', () => {
      const body = {
        group,
        startTime,
        tournamentId
      } as MatchRequest;
      const homeTeam = {
        teamId: homeTeamId,
        teamName: homeTeamName,
        shortName: homeTeamShortName,
        image: homeTeamImage
      } as TeamDocument;
      const awayTeam = {
        teamId: awayTeamId,
        teamName: awayTeamName,
        shortName: awayTeamShortName,
        image: awayTeamImage
      } as TeamDocument;
      const tournament = {
        tournamentId,
        tournamentName
      } as TournamentDocument;

      const expectedMatch: [MatchDetailsDocument, MatchTeamDocument, MatchTeamDocument, MatchTournamentDocument] = [
        {
          group,
          startTime,
          matchId,
          'documentType-id': `match-${matchId}`,
          documentType: 'match',
          orderingValue: `${tournamentId}-${startTime}`,
          segment: 'details'
        },
        {
          matchId,
          teamId: homeTeamId,
          teamName: homeTeamName,
          shortName: homeTeamShortName,
          image: homeTeamImage,
          'documentType-id': `match-${matchId}`,
          documentType: 'match',
          orderingValue: `${tournamentId}-${startTime}`,
          segment: 'homeTeam'
        },
        {
          matchId,
          teamId: awayTeamId,
          teamName: awayTeamName,
          shortName: awayTeamShortName,
          image: awayTeamImage,
          'documentType-id': `match-${matchId}`,
          documentType: 'match',
          orderingValue: `${tournamentId}-${startTime}`,
          segment: 'awayTeam'
        },
        {
          matchId,
          tournamentId,
          tournamentName,
          'documentType-id': `match-${matchId}`,
          documentType: 'match',
          orderingValue: `${tournamentId}-${startTime}`,
          segment: 'tournament'
        }
      ];

      const result = converter.save(matchId, body, homeTeam, awayTeam, tournament);
      expect(result).toEqual(expectedMatch.map<DynamoDB.DocumentClient.TransactWriteItem>(m => ({
        Put: {
          TableName: tableName,
          Item: m
        }
      })));
    });
  });

  describe('update', () => {
    it('should return a list of transact write items', () => {
      const body = {
        group,
        startTime
      } as MatchRequest;
      const homeTeam = {
        teamId: homeTeamId,
        teamName: homeTeamName,
        shortName: homeTeamShortName,
        image: homeTeamImage
      } as TeamDocument;
      const awayTeam = {
        teamId: awayTeamId,
        teamName: awayTeamName,
        shortName: awayTeamShortName,
        image: awayTeamImage
      } as TeamDocument;
      const tournament = {
        tournamentId,
        tournamentName
      } as TournamentDocument;

      const expectedItems: DynamoDB.DocumentClient.TransactWriteItemList = [
        {
          Update: {
            TableName: tableName,
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
              ':startTime': startTime,
              ':group': group,
              ':orderingValue': `${tournamentId}-${startTime}`,
              ':documentTypeId': `match-${matchId}`,
              ':segment': 'details'
            }
          }
        },
        {
          Update: {
            TableName: tableName,
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
              ':teamId': homeTeamId,
              ':teamName': homeTeamName,
              ':shortName': homeTeamShortName,
              ':image': homeTeamImage,
              ':orderingValue': `${tournamentId}-${startTime}`,
              ':documentTypeId': `match-${matchId}`,
              ':segment': 'homeTeam'
            }
          }
        },
        {
          Update: {
            TableName: tableName,
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
              ':teamId': awayTeamId,
              ':teamName': awayTeamName,
              ':shortName': awayTeamShortName,
              ':image': awayTeamImage,
              ':orderingValue': `${tournamentId}-${startTime}`,
              ':documentTypeId': `match-${matchId}`,
              ':segment': 'awayTeam'
            }
          }
        },
        {
          Update: {
            TableName: tableName,
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
              ':tournamentId': tournamentId,
              ':tournamentName': tournamentName,
              ':orderingValue': `${tournamentId}-${startTime}`,
              ':documentTypeId': `match-${matchId}`,
              ':segment': 'tournament'
            }
          }
        }
      ];

      const result = converter.update(matchId, body, homeTeam, awayTeam, tournament);
      expect(result).toEqual(expectedItems);
    });
  });

  describe('delete', () => {
    it('should return a list of transact write items', () => {
      const matchSegments = ['details', 'homeTeam', 'awayTeam', 'tournament', 'finalScore'];

      const result = converter.delete(matchId);
      expect(result).toEqual(matchSegments.map<DynamoDB.DocumentClient.TransactWriteItem>(segment => ({
        Delete: {
          TableName: tableName,
          Key: {
            segment,
            'documentType-id': `match-${matchId}`
          }
        }
      })));
    });
  });

  describe('updateMatchesWithTeam', () => {
    it('should return a list of transact write items', () => {
      const matchKeys: DocumentKey<'homeTeam' | 'awayTeam'>[] = [
        {
          'documentType-id': 'match-matchId1',
          segment: 'homeTeam'
        },
        {
          'documentType-id': 'match-matchId2',
          segment: 'awayTeam'
        }
      ];

      const result = converter.updateMatchesWithTeam(matchKeys, {
        image: homeTeamImage,
        shortName: homeTeamShortName,
        teamName: homeTeamName
      });
      expect(result).toEqual(matchKeys.map<DynamoDB.DocumentClient.TransactWriteItem>(key => ({
        Update: {
          TableName: tableName,
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
            ':teamName': homeTeamName,
            ':image': homeTeamImage,
            ':shortName': homeTeamShortName
          }
        }
      })));
    });
  });

  describe('updateMatchesWithTournament', () => {
    it('should return a list of transact write items', () => {
      const matchKeys: DocumentKey<'tournament'>[] = [
        {
          'documentType-id': 'match-matchId1',
          segment: 'tournament'
        },
        {
          'documentType-id': 'match-matchId2',
          segment: 'tournament'
        }
      ];

      const result = converter.updateMatchesWithTournament(matchKeys, {
        tournamentName
      });
      expect(result).toEqual(matchKeys.map<DynamoDB.DocumentClient.TransactWriteItem>(key => ({
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
      })));
    });
  });
});
