import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { teamDocument, teamResponse, teamRequest } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('Team document converter', () => {
  let converter: ITeamDocumentConverter;
  let mockUuid: jest.Mock;
  const teamId = 'teamId' as TeamIdType;
  const now = 1591443246;
  const nowDate = new Date(now * 1000);

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = teamDocumentConverterFactory(mockUuid);

    advanceTo(nowDate);
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

      const expectedDocument = teamDocument({ modifiedAt: nowDate.toISOString() });

      const result = converter.create(body, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a team document with expiration date set if it is a test data', () => {
      const body = teamRequest();

      mockUuid.mockReturnValue(teamId);

      const expectedDocument = teamDocument({
        expiresAt: now + 3600,
        modifiedAt: nowDate.toISOString()
      });

      const result = converter.create(body, 3600);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a team document for update', () => {
      const body = teamRequest();

      const expectedDocument = teamDocument({ modifiedAt: nowDate.toISOString() });

      const result = converter.update(teamId, body, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should return a team document for update with expiration date set if it is a test data', () => {
      const body = teamRequest();

      const expectedDocument = teamDocument({
        expiresAt: now + 3600,
        modifiedAt: nowDate.toISOString()
      });

      const result = converter.update(teamId, body, 3600);
      expect(result).toEqual(expectedDocument);
    });
  });
});
