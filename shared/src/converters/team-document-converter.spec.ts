import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { teamDocument, teamResponse, teamRequest } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';

describe('Team document converter', () => {
  let converter: ITeamDocumentConverter;
  let mockUuid: jest.Mock;
  const teamId = 'teamId';
  const now = 1591443246;

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = teamDocumentConverterFactory(mockUuid);

    advanceTo(new Date(now * 1000));
  });

  afterEach(() => {
    clear();
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

      const result = converter.create(body, false);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a team document with expiration date set if it is a test data', () => {
      const body = teamRequest();

      mockUuid.mockReturnValue(teamId);

      const expectedDocument = teamDocument({
        expiresAt: now + 3600
      });

      const result = converter.create(body, true);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a team document for update', () => {
      const body = teamRequest();

      const expectedDocument = teamDocument();

      const result = converter.update(teamId, body, false);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a team document for update with expiration date set if it is a test data', () => {
      const body = teamRequest();

      const expectedDocument = teamDocument({
        expiresAt: now + 3600
      });

      const result = converter.update(teamId, body, true);
      expect(result).toEqual(expectedDocument);
    });
  });
});
