import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { matchDocument, matchResponse, matchRequest, teamDocument, tournamentDocument } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';
import { TeamIdType, MatchIdType } from '@foci2020/shared/types/common';

describe('Match document converter', () => {
  let converter: IMatchDocumentConverter;
  let mockUuid: jest.Mock;
  const matchId = 'matchId' as MatchIdType;
  const now = 1591443246;
  const nowDate = new Date(now * 1000);

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = matchDocumentConverterFactory(mockUuid);
    advanceTo(nowDate);
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
      const homeTeam = teamDocument({
        id: 'homeTeamId' as TeamIdType, 
      });
      const awayTeam = teamDocument({
        id: 'awayTeamId' as TeamIdType, 
      });
      const tournament = tournamentDocument();

      mockUuid.mockReturnValue(matchId);

      const expectedDocument = matchDocument({
        modifiedAt: nowDate.toISOString(), 
      });

      const result = converter.create(body, homeTeam, awayTeam, tournament, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a match document with expiration date set if it is a test data', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({
        id: 'homeTeamId' as TeamIdType, 
      });
      const awayTeam = teamDocument({
        id: 'awayTeamId' as TeamIdType, 
      });
      const tournament = tournamentDocument();

      mockUuid.mockReturnValue(matchId);

      const expectedDocument = matchDocument({
        expiresAt: now + 3600,
        modifiedAt: nowDate.toISOString(),
      });

      const result = converter.create(body, homeTeam, awayTeam, tournament, 3600);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a match document for update', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({
        id: 'homeTeamId' as TeamIdType, 
      });
      const awayTeam = teamDocument({
        id: 'awayTeamId' as TeamIdType, 
      });
      const tournament = tournamentDocument();
      const expectedDocument = matchDocument({
        modifiedAt: nowDate.toISOString(), 
      });

      const result = converter.update(matchId, body, homeTeam, awayTeam, tournament, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a match document for update with expiration date set if it is a test data', () => {
      const body = matchRequest();
      const homeTeam = teamDocument({
        id: 'homeTeamId' as TeamIdType, 
      });
      const awayTeam = teamDocument({
        id: 'awayTeamId' as TeamIdType, 
      });
      const tournament = tournamentDocument();
      const expectedDocument = matchDocument({
        expiresAt: now + 3600,
        modifiedAt: nowDate.toISOString(),
      });

      const result = converter.update(matchId, body, homeTeam, awayTeam, tournament, 3600);
      expect(result).toEqual(expectedDocument);
    });
  });
});
