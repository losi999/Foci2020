import { IDeleteTeamService, deleteTeamServiceFactory } from '@/functions/delete-team/delete-team-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IDatabaseService } from '@/services/database-service';

describe('Delete team service', () => {
  let service: IDeleteTeamService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteTeam');

    service = deleteTeamServiceFactory(mockDatabaseService.service);
  });

  it('should return with undefined', async () => {
    const teamId = 'teamId';

    mockDatabaseService.functions.deleteTeam.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.deleteTeam, teamId);
    expect.assertions(2);
  });

  it('should throw error if unable to delete team', async () => {
    const teamId = 'teamId';

    mockDatabaseService.functions.deleteTeam.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to delete team', 500));
    validateFunctionCall(mockDatabaseService.functions.deleteTeam, teamId);
    expect.assertions(3);
  });
});
