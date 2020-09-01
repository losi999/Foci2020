import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { tournamentDocument, tournamentResponse, tournamentRequest } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';
import { TournamentIdType } from '@foci2020/shared/types/common';

describe('Tournament document converter', () => {
  let converter: ITournamentDocumentConverter;
  let mockUuid: jest.Mock;
  const tournamentId = 'tournamentId' as TournamentIdType;
  const now = 1591443246;

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = tournamentDocumentConverterFactory(mockUuid);

    advanceTo(new Date(now * 1000));
  });

  afterEach(() => {
    clear();
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input = tournamentDocument();
      const expectedResponse = tournamentResponse();

      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input = tournamentDocument();
      const expectedResponse = tournamentResponse();

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a tournament document', () => {
      const body = tournamentRequest();

      mockUuid.mockReturnValue(tournamentId);

      const expectedDocument = tournamentDocument();

      const result = converter.create(body, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a tournament document with expiration date set if it is a test data', () => {
      const body = tournamentRequest();

      mockUuid.mockReturnValue(tournamentId);

      const expectedDocument = tournamentDocument({
        expiresAt: now + 3600
      });

      const result = converter.create(body, 3600);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a tournament document for update', () => {
      const body = tournamentRequest();

      const expectedDocument = tournamentDocument();

      const result = converter.update(tournamentId, body, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a tournament document for update with expiration date set if it is a test data', () => {
      const body = tournamentRequest();

      const expectedDocument = tournamentDocument({
        expiresAt: now + 3600
      });

      const result = converter.update(tournamentId, body, 3600);
      expect(result).toEqual(expectedDocument);
    });
  });
});
