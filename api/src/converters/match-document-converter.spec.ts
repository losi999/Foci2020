import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@/converters/match-document-converter';
import { matchDocument, matchResponse, matchRequest, teamDocument, tournamentDocument } from './test-data-factory';
import { Score } from '@/types/types';

describe('Match document converter', () => {
  let converter: IMatchDocumentConverter;
  let mockUuid: jest.Mock;
  const matchId = 'matchId';
  const homeTeamId = 'homeTeamId';
  const awayTeamId = 'awayTeamId';
  const tournamentId = 'tournamentId';
  const finalScore: Score = {
    homeScore: 1,
    awayScore: 3,
  };

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = matchDocumentConverterFactory(mockUuid);
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input = matchDocument(matchId, homeTeamId, awayTeamId, tournamentId, finalScore);
      const expectedResponse = matchResponse(matchId, homeTeamId, awayTeamId, tournamentId, finalScore);

      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input = matchDocument(matchId, homeTeamId, awayTeamId, tournamentId, finalScore);
      const expectedResponse = matchResponse(matchId, homeTeamId, awayTeamId, tournamentId, finalScore);

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a match document', () => {
      const body = matchRequest(homeTeamId, awayTeamId, tournamentId);
      const homeTeam = teamDocument(homeTeamId);
      const awayTeam = teamDocument(awayTeamId);
      const tournament = tournamentDocument(tournamentId);

      mockUuid.mockReturnValue(matchId);

      const expectedDocument = matchDocument(matchId, homeTeamId, awayTeamId, tournamentId);

      const result = converter.create(body, homeTeam, awayTeam, tournament);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a match document for update', () => {
      const body = matchRequest(homeTeamId, awayTeamId, tournamentId);
      const homeTeam = teamDocument(homeTeamId);
      const awayTeam = teamDocument(awayTeamId);
      const tournament = tournamentDocument(tournamentId);
      const expectedDocument = matchDocument(matchId, homeTeamId, awayTeamId, tournamentId);

      const result = converter.update(matchId, body, homeTeam, awayTeam, tournament);
      expect(result).toEqual(expectedDocument);
    });
  });
});
