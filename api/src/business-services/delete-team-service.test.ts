import { IDatabaseService } from '@/services/database-service';
import { IDeleteTeamService, deleteTeamServiceFactory } from '@/business-services/delete-team-service';

describe('Delete team service', () => {
  let service: IDeleteTeamService;
  let mockDatabaseService: IDatabaseService;
  let mockDeleteTeam: jest.Mock;

  beforeEach(() => {
    mockDeleteTeam = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      deleteTeam: mockDeleteTeam,
    }))) as IDatabaseService;

    service = deleteTeamServiceFactory(mockDatabaseService);
  });

  it('should return with a team', async () => {
    const teamId = 'teamId';

    mockDeleteTeam.mockResolvedValue(undefined);

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
      expect(error.message).toEqual('Unable to query team');
    }
  });
});
