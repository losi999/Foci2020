import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@/converters/match-document-converter';
import { MatchResponse } from '@/types/responses';
import { TournamentDocument, TeamDocument, MatchDocument, MatchDocumentUpdatable } from '@/types/documents';
import { MatchRequest } from '@/types/requests';

describe('Match document converter', () => {
  let converter: IMatchDocumentConverter;
  let mockUuid: jest.Mock;
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
  const homeScore = 1;
  const awayScore = 2;

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = matchDocumentConverterFactory(mockUuid);
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input: MatchDocument = {
        startTime,
        group,
        homeTeamId,
        awayTeamId,
        tournamentId,
        homeScore,
        awayScore,
        homeTeam: {
          id: homeTeamId,
          teamName: homeTeamName,
          shortName: homeTeamShortName,
          image: homeTeamImage
        } as TeamDocument,
        awayTeam: {
          id: awayTeamId,
          teamName: awayTeamName,
          shortName: awayTeamShortName,
          image: awayTeamImage
        } as TeamDocument,
        tournament: {
          tournamentName,
          id: tournamentId,
        } as TournamentDocument,
        id: matchId,
        orderingValue: 'ordering',
        documentType: 'match',
        'documentType-id': `match-${matchId}`
      };
      const expectedResponse: MatchResponse = {
        matchId,
        startTime,
        group,
        homeTeam: {
          teamId: homeTeamId,
          teamName: homeTeamName,
          image: homeTeamImage,
          shortName: homeTeamShortName
        },
        awayTeam: {
          teamId: awayTeamId,
          teamName: awayTeamName,
          image: awayTeamImage,
          shortName: awayTeamShortName
        },
        tournament: {
          tournamentId,
          tournamentName
        },
        finalScore: {
          homeScore,
          awayScore
        }

      };
      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input: MatchDocument = {
        startTime,
        group,
        homeTeamId,
        awayTeamId,
        tournamentId,
        homeScore,
        awayScore,
        homeTeam: {
          id: homeTeamId,
          teamName: homeTeamName,
          shortName: homeTeamShortName,
          image: homeTeamImage
        } as TeamDocument,
        awayTeam: {
          id: awayTeamId,
          teamName: awayTeamName,
          shortName: awayTeamShortName,
          image: awayTeamImage
        } as TeamDocument,
        tournament: {
          tournamentName,
          id: tournamentId,
        } as TournamentDocument,
        id: matchId,
        orderingValue: 'ordering',
        documentType: 'match',
        'documentType-id': `match-${matchId}`
      };
      const expectedResponse: MatchResponse = {
        matchId,
        startTime,
        group,
        homeTeam: {
          teamId: homeTeamId,
          teamName: homeTeamName,
          image: homeTeamImage,
          shortName: homeTeamShortName
        },
        awayTeam: {
          teamId: awayTeamId,
          teamName: awayTeamName,
          image: awayTeamImage,
          shortName: awayTeamShortName
        },
        tournament: {
          tournamentId,
          tournamentName
        },
        finalScore: {
          homeScore,
          awayScore
        }

      };
      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a team document', () => {
      const body: MatchRequest = {
        homeTeamId,
        awayTeamId,
        tournamentId,
        startTime,
        group
      };

      const homeTeam = {
        id: homeTeamId,
        shortName: homeTeamShortName,
        image: homeTeamImage,
        teamName: homeTeamName
      } as TeamDocument;

      const awayTeam = {
        id: awayTeamId,
        shortName: awayTeamShortName,
        image: awayTeamImage,
        teamName: awayTeamName
      } as TeamDocument;

      const tournament = {
        tournamentName,
        id: tournamentId,
      } as TournamentDocument;

      mockUuid.mockReturnValue(matchId);

      const expectedDocument: MatchDocument = {
        homeTeamId,
        awayTeamId,
        tournamentId,
        startTime,
        group,
        homeTeam,
        awayTeam,
        tournament,
        id: matchId,
        orderingValue: `${tournamentId}-${startTime}`,
        documentType: 'match',
        'documentType-id': `match-${matchId}`
      };

      const result = converter.create(body, homeTeam, awayTeam, tournament);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a team document for update', () => {
      const body: MatchRequest = {
        homeTeamId,
        awayTeamId,
        tournamentId,
        startTime,
        group
      };

      const homeTeam = {
        id: homeTeamId,
        shortName: homeTeamShortName,
        image: homeTeamImage,
        teamName: homeTeamName
      } as TeamDocument;

      const awayTeam = {
        id: awayTeamId,
        shortName: awayTeamShortName,
        image: awayTeamImage,
        teamName: awayTeamName
      } as TeamDocument;

      const tournament = {
        tournamentName,
        id: tournamentId,
      } as TournamentDocument;

      const expectedDocument: MatchDocumentUpdatable = {
        startTime,
        group,
        awayTeamId,
        homeTeamId,
        tournamentId,
        homeTeam,
        awayTeam,
        tournament,
      };

      const result = converter.update(body, homeTeam, awayTeam, tournament);
      expect(result).toEqual(expectedDocument);
    });
  });
});
