import { IDeleteTeamService, deleteTeamServiceFactory } from '@/business-services/delete-team-service';
import { INotificationService } from '@/services/notification-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { Mock, createMockService, validateError } from '@/common';

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
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to delete team', 500));
  });

  it('should throw error if unable to send notification', async () => {
    const teamId = 'teamId';

    mockTeamDocumentService.functions.deleteTeam.mockResolvedValue(undefined);
    mockNotificationService.functions.teamDeleted.mockRejectedValue('This is an SNS error');

    await service({ teamId }).catch(validateError('Unable to send team deleted notification', 500));
  });
});
