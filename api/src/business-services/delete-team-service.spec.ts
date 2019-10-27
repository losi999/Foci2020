import { IDatabaseService } from '@/services/database-service';
import { IDeleteTeamService, deleteTeamServiceFactory } from '@/business-services/delete-team-service';
import { INotificationService } from '@/services/notification-service';

describe('Delete team service', () => {
  let service: IDeleteTeamService;
  let mockDatabaseService: IDatabaseService;
  let mockDeleteTeam: jest.Mock;
  let mockNotificationService: INotificationService;
  let mockTeamDeleted: jest.Mock;

  beforeEach(() => {
    mockDeleteTeam = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      deleteTeam: mockDeleteTeam,
    }))) as IDatabaseService;

    mockTeamDeleted = jest.fn();
    mockNotificationService = new (jest.fn<Partial<INotificationService>, undefined[]>(() => ({
      teamDeleted: mockTeamDeleted
    })))() as INotificationService;

    service = deleteTeamServiceFactory(mockDatabaseService, mockNotificationService);
  });

  it('should return with undefined', async () => {
    const teamId = 'teamId';

    mockDeleteTeam.mockResolvedValue(undefined);
    mockTeamDeleted.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';

    mockDeleteTeam.mockRejectedValue('This is a dynamo error');

    try {
      await service({ teamId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to delete team');
    }
  });

  it('should throw error if unable to send notification', async () => {
    const teamId = 'teamId';

    mockDeleteTeam.mockResolvedValue(undefined);
    mockTeamDeleted.mockRejectedValue('This is an SNS error');

    try {
      await service({ teamId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to send team deleted notification');
    }
  });
});
