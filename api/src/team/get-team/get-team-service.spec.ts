import { IGetTeamService, getTeamServiceFactory } from '@/team/get-team/get-team-service';
import { ITeamDocumentConverter } from '@/team/team-document-converter';
import { ITeamDocumentService } from '@/team/team-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { TeamDocument, TeamResponse } from '@/shared/types/types';

describe('Get team service', () => {
  let service: IGetTeamService;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('queryTeamById');

    mockTeamDocumentConverter = createMockService('toResponse');

    service = getTeamServiceFactory(mockTeamDocumentService.service, mockTeamDocumentConverter.service);
  });

  it('should return with a team', async () => {
    const teamId = 'teamId';
    const teamName = 'Team';
    const teamDocument = {
      teamName,
      id: teamId,
    } as TeamDocument;

    mockTeamDocumentService.functions.queryTeamById.mockResolvedValue(teamDocument);

    const teamResponse = {
      teamId,
      teamName
    } as TeamResponse;

    mockTeamDocumentConverter.functions.toResponse.mockReturnValue(teamResponse);

    const result = await service({ teamId });
    expect(result).toEqual(teamResponse);
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamDocumentConverter.functions.toResponse).toHaveBeenCalledWith(teamDocument);
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';
    mockTeamDocumentService.functions.queryTeamById.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to query team', 500));
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no team found', async () => {
    const teamId = 'teamId';
    mockTeamDocumentService.functions.queryTeamById.mockResolvedValue(undefined);

    await service({ teamId }).catch(validateError('No team found', 404));
    expect(mockTeamDocumentService.functions.queryTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
