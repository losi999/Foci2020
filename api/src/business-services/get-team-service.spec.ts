import { IGetTeamService, getTeamServiceFactory } from '@/business-services/get-team-service';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITeamDocumentService } from '@/services/team-document-service';

describe('Get team service', () => {
  let service: IGetTeamService;
  let mockTeamDocumentService: ITeamDocumentService;
  let mockQueryTeamById: jest.Mock;
  let mockTeamDocumentConverter: ITeamDocumentConverter;
  let mockCreateResponse: jest.Mock;

  beforeEach(() => {
    mockQueryTeamById = jest.fn();
    mockTeamDocumentService = new (jest.fn<Partial<ITeamDocumentService>, undefined[]>(() => ({
      queryTeamById: mockQueryTeamById,
    }))) as ITeamDocumentService;

    mockCreateResponse = jest.fn();
    mockTeamDocumentConverter = new (jest.fn<Partial<ITeamDocumentConverter>, undefined[]>(() => ({
      createResponse: mockCreateResponse
    })))() as ITeamDocumentConverter;

    service = getTeamServiceFactory(mockTeamDocumentService, mockTeamDocumentConverter);
  });

  it('should return with a team', async () => {
    const teamId = 'teamId';
    const teamName = 'Team';
    const teamDocument = {
      teamId,
      teamName,
      segment: 'details',
    } as TeamDocument;

    mockQueryTeamById.mockResolvedValue(teamDocument);

    const teamResponse = {
      teamId,
      teamName
    } as TeamResponse;

    mockCreateResponse.mockReturnValue(teamResponse);

    const result = await service({ teamId });
    expect(result).toEqual(teamResponse);
    expect(mockCreateResponse).toHaveBeenCalledWith(teamDocument);
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';
    mockQueryTeamById.mockRejectedValue('This is a dynamo error');

    try {
      await service({ teamId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query team');
    }
  });
});
