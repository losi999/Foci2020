import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { matchDocument, matchResponse, matchRequest, teamDocument, tournamentDocument } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';

describe('Match document converter', () => {
  let converter: IMatchDocumentConverter;
  let mockUuid: jest.Mock;
  const matchId = 'matchId';
  const now = 1591443246;

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = matchDocumentConverterFactory(mockUuid);
    advanceTo(new Date(now * 1000));
  });

  afterEach(() => {
    clear();
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input = matchDocument();
      const expectedResponse = matchResponse();

      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input = matchDocument();
      const expectedResponse = matchResponse();

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a match document', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({ id: 'homeTeamId' });
      const awayTeam = teamDocument({ id: 'awayTeamId' });
      const tournament = tournamentDocument();

      mockUuid.mockReturnValue(matchId);

      const expectedDocument = matchDocument();

      const result = converter.create(body, homeTeam, awayTeam, tournament, false);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a match document with expiration date set if it is a test data', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({ id: 'homeTeamId' });
      const awayTeam = teamDocument({ id: 'awayTeamId' });
      const tournament = tournamentDocument();

      mockUuid.mockReturnValue(matchId);

      const expectedDocument = matchDocument({
        expiresAt: now + 3600
      });

      const result = converter.create(body, homeTeam, awayTeam, tournament, true);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a match document for update', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({ id: 'homeTeamId' });
      const awayTeam = teamDocument({ id: 'awayTeamId' });
      const tournament = tournamentDocument();
      const expectedDocument = matchDocument();

      const result = converter.update(matchId, body, homeTeam, awayTeam, tournament, false);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a match document for update with expiration date set if it is a test data', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({ id: 'homeTeamId' });
      const awayTeam = teamDocument({ id: 'awayTeamId' });
      const tournament = tournamentDocument();
      const expectedDocument = matchDocument({
        expiresAt: now + 3600
      });

      const result = converter.update(matchId, body, homeTeam, awayTeam, tournament, true);
      expect(result).toEqual(expectedDocument);
    });
  });
});
