import { createTeamServiceFactory, ICreateTeamService } from '@/business-services/create-team-service';
import { IDatabaseService } from '@/services/database-service';
import { TeamRequest } from '@/types';
describe('Create team service', () => {
  let mockDatabaseService: IDatabaseService;
  let mockSaveTeam: jest.Mock;
  let mockUuid: jest.Mock;
  let service: ICreateTeamService;

  beforeEach(() => {
    mockSaveTeam = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      saveTeam: mockSaveTeam
    })))() as IDatabaseService;

    mockUuid = jest.fn();

    service = createTeamServiceFactory(mockDatabaseService, mockUuid);
  });

  it('should throw error if unable to save team', async () => {
    const body = {} as TeamRequest;
    mockUuid.mockReturnValue('uuid');
    mockSaveTeam.mockRejectedValue({});
    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while saving team');
    }
  });

  it('should return undefined if team is saved', async () => {
    const body = {} as TeamRequest;
    mockUuid.mockReturnValue('uuid');
    mockSaveTeam.mockResolvedValue(undefined);
    const result = await service({ body });
    expect(result).toBeUndefined();
    expect(mockSaveTeam).toHaveBeenCalledWith({
      teamId: 'uuid',
      documentType: 'team',
      partitionKey: 'team-uuid',
      sortKey: 'details',
    });
  });
});
