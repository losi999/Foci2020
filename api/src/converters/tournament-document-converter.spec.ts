import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@/converters/tournament-document-converter';
import { TournamentResponse } from '@/types/responses';
import { TournamentDocument, TournamentDocumentUpdatable } from '@/types/documents';
import { TournamentRequest } from '@/types/requests';

describe('Tournament document converter', () => {
  let converter: ITournamentDocumentConverter;
  let mockUuid: jest.Mock;
  const tournamentId = 'tournamentId';
  const tournamentName = 'tournament';

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = tournamentDocumentConverterFactory(mockUuid);
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input: TournamentDocument = {
        tournamentName,
        id: tournamentId,
        orderingValue: tournamentName,
        documentType: 'tournament',
        'documentType-id': `tournament-${tournamentId}`
      };
      const expectedResponse: TournamentResponse = {
        tournamentName,
        tournamentId,
      };
      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input: TournamentDocument = {
        tournamentName,
        id: tournamentId,
        orderingValue: tournamentName,
        documentType: 'tournament',
        'documentType-id': `tournament-${tournamentId}`
      };
      const expectedResponse: TournamentResponse = {
        tournamentName,
        tournamentId,
      };
      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a tournament document', () => {
      const body: TournamentRequest = {
        tournamentName
      };

      mockUuid.mockReturnValue(tournamentId);

      const expectedDocument: TournamentDocument = {
        tournamentName,
        id: tournamentId,
        orderingValue: tournamentName,
        documentType: 'tournament',
        'documentType-id': `tournament-${tournamentId}`
      };

      const result = converter.create(body);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a tournament document for update', () => {
      const body: TournamentRequest = {
        tournamentName
      };

      const expectedDocument: TournamentDocumentUpdatable = {
        tournamentName,
      };

      const result = converter.update(body);
      expect(result).toEqual(expectedDocument);
    });
  });
});
