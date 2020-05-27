import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { teamDocument, teamResponse, teamRequest } from '@foci2020/shared/common/test-data-factory';

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
      const input = teamDocument();
      const expectedResponse = teamResponse();

      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input = teamDocument();
      const expectedResponse = teamResponse();

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a team document', () => {
      const body = teamRequest();

      mockUuid.mockReturnValue(teamId);

      const expectedDocument = teamDocument();

      const result = converter.create(body);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a team document for update', () => {
      const body = teamRequest();

      const expectedDocument = teamDocument();

      const result = converter.update(teamId, body);
      expect(result).toEqual(expectedDocument);
    });
  });
});
