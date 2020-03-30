import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@/converters/tournament-document-converter';
import { tournamentResponse, tournamentDocument, tournamentRequest } from '@/common/test-data-factory';

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

      const result = converter.create(body);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a tournament document for update', () => {
      const body = tournamentRequest();

      const expectedDocument = tournamentDocument();

      const result = converter.update(tournamentId, body);
      expect(result).toEqual(expectedDocument);
    });
  });
});
