import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@/team/team-document-converter';
import { teamDocument, teamRequest, teamResponse } from '@/shared/converters/test-data-factory';

describe('Team document converter', () => {
  let converter: ITeamDocumentConverter;
  let mockUuid: jest.Mock;
  const teamId = 'teamId';

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = teamDocumentConverterFactory(mockUuid);
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input = teamDocument(teamId);
      const expectedResponse = teamResponse(teamId);

      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input = teamDocument(teamId);
      const expectedResponse = teamResponse(teamId);

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a team document', () => {
      const body = teamRequest();

      mockUuid.mockReturnValue(teamId);

      const expectedDocument = teamDocument(teamId);

      const result = converter.create(body);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a team document for update', () => {
      const body = teamRequest();

      const expectedDocument = teamDocument(teamId);

      const result = converter.update(teamId, body);
      expect(result).toEqual(expectedDocument);
    });
  });
});
