import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@/converters/team-document-converter';
import { TeamResponse } from '@/types/responses';
import { TeamDocument, TeamDocumentUpdatable } from '@/types/documents';
import { TeamRequest } from '@/types/requests';

describe('Team document converter', () => {
  let converter: ITeamDocumentConverter;
  let mockUuid: jest.Mock;
  const teamId = 'teamId';
  const teamName = 'homeTeam';
  const shortName = 'HMT';
  const image = 'http://image.com/home.png';

  beforeEach(() => {
    mockUuid = jest.fn();

    converter = teamDocumentConverterFactory(mockUuid);
  });

  describe('toResponse', () => {
    it('should convert document to response', () => {
      const input: TeamDocument = {
        teamName,
        shortName,
        image,
        id: teamId,
        orderingValue: teamName,
        documentType: 'team',
        'documentType-id': `team-${teamId}`
      };
      const expectedResponse: TeamResponse = {
        teamName,
        teamId,
        shortName,
        image
      };
      const result = converter.toResponse(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('toResponseList', () => {
    it('should convert documents to responses', () => {
      const input: TeamDocument = {
        teamName,
        shortName,
        image,
        id: teamId,
        orderingValue: teamName,
        documentType: 'team',
        'documentType-id': `team-${teamId}`
      };
      const expectedResponse: TeamResponse = {
        teamName,
        teamId,
        shortName,
        image
      };
      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('create', () => {
    it('should return a team document', () => {
      const body: TeamRequest = {
        teamName,
        image,
        shortName
      };

      mockUuid.mockReturnValue(teamId);

      const expectedDocument: TeamDocument = {
        teamName,
        shortName,
        image,
        id: teamId,
        orderingValue: teamName,
        documentType: 'team',
        'documentType-id': `team-${teamId}`
      };

      const result = converter.create(body);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('update', () => {
    it('should return a team document for update', () => {
      const body: TeamRequest = {
        teamName,
        shortName,
        image,
      };

      const expectedDocument: TeamDocumentUpdatable = {
        teamName,
        shortName,
        image,
      };

      const result = converter.update(body);
      expect(result).toEqual(expectedDocument);
    });
  });
});
