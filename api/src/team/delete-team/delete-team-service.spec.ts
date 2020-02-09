import { IDeleteTeamService, deleteTeamServiceFactory } from '@/team/delete-team/delete-team-service';
import { INotificationService } from '@/shared/services/notification-service';
import { ITeamDocumentService } from '@/team/team-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';

describe('Delete team service', () => {
  let service: IDeleteTeamService;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockNotificationService: Mock<INotificationService>;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('deleteTeam');
    mockNotificationService = createMockService('teamDeleted');

    service = deleteTeamServiceFactory(mockTeamDocumentService.service, mockNotificationService.service);
  });

  it('should return with undefined', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockResolvedValue(undefined);
    mockNotificationService.functions.teamDeleted.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    expect(mockTeamDocumentService.functions.deleteTeam).toHaveBeenCalledWith(teamId);
    expect(mockNotificationService.functions.teamDeleted).toHaveBeenCalledWith(teamId);
  });

  it('should throw error if unable to delete team', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to delete team', 500));
    expect(mockTeamDocumentService.functions.deleteTeam).toHaveBeenCalledWith(teamId);
    expect(mockNotificationService.functions.teamDeleted).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if unable to send notification', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockResolvedValue(undefined);
    mockNotificationService.functions.teamDeleted.mockRejectedValue('This is an SNS error');

    await service({ teamId }).catch(validateError('Unable to send team deleted notification', 500));
    expect(mockTeamDocumentService.functions.deleteTeam).toHaveBeenCalledWith(teamId);
    expect(mockNotificationService.functions.teamDeleted).toHaveBeenCalledWith(teamId);
    expect.assertions(4);
  });
});