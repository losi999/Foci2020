import { IDeleteTeamService, deleteTeamServiceFactory } from '@/functions/delete-team/delete-team-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';

describe('Delete team service', () => {
  let service: IDeleteTeamService;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('deleteTeam');

    service = deleteTeamServiceFactory(mockTeamDocumentService.service);
  });

  it('should return with undefined', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    expect(mockTeamDocumentService.functions.deleteTeam).toHaveBeenCalledWith(teamId);
    expect.assertions(2);
  });

  it('should throw error if unable to delete team', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to delete team', 500));
    expect(mockTeamDocumentService.functions.deleteTeam).toHaveBeenCalledWith(teamId);
    expect.assertions(3);
  });
});
