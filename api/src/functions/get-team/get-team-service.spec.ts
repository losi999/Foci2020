import { IGetTeamService, getTeamServiceFactory } from '@/functions/get-team/get-team-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { TeamDocument, TeamResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('Get team service', () => {
  let service: IGetTeamService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getTeamById');

    mockTeamDocumentConverter = createMockService('toResponse');

    service = getTeamServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  it('should return with a team', async () => {
    const teamId = 'teamId';
    const teamName = 'Team';
    const teamDocument = {
      teamName,
      id: teamId,
    } as TeamDocument;

    mockDatabaseService.functions.getTeamById.mockResolvedValue(teamDocument);

    const teamResponse = {
      teamId,
      teamName
    } as TeamResponse;

    mockTeamDocumentConverter.functions.toResponse.mockReturnValue(teamResponse);

    const result = await service({ teamId });
    expect(result).toEqual(teamResponse);
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamDocumentConverter.functions.toResponse).toHaveBeenCalledWith(teamDocument);
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';
    mockDatabaseService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to query team', 500));
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no team found', async () => {
    const teamId = 'teamId';
    mockDatabaseService.functions.getTeamById.mockResolvedValue(undefined);

    await service({ teamId }).catch(validateError('No team found', 404));
    expect(mockDatabaseService.functions.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
