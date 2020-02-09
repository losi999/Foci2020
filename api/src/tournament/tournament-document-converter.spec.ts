import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@/tournament/tournament-document-converter';
import { tournamentResponse, tournamentDocument, tournamentRequest } from '@/shared/converters/test-data-factory';

describe('Tournament document converter', () => {
  let converter: ITournamentDocumentConverter;
  let mockUuid: jest.Mock;
  const tournamentId = 'tournamentId';

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = tournamentDocumentConverterFactory(mockUuid);
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input = tournamentDocument(tournamentId);
      const expectedResponse = tournamentResponse(tournamentId);

      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input = tournamentDocument(tournamentId);
      const expectedResponse = tournamentResponse(tournamentId);

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a tournament document', () => {
      const body = tournamentRequest();

      mockUuid.mockReturnValue(tournamentId);

      const expectedDocument = tournamentDocument(tournamentId);

      const result = converter.create(body);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a tournament document for update', () => {
      const body = tournamentRequest();

      const expectedDocument = tournamentDocument(tournamentId);

      const result = converter.update(tournamentId, body);
      expect(result).toEqual(expectedDocument);
    });
  });
});
