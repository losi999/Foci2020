import { IDeleteTeamService, deleteTeamServiceFactory } from '@foci2020/api/functions/delete-team/delete-team-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('Delete team service', () => {
  let service: IDeleteTeamService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteTeam');

    service = deleteTeamServiceFactory(mockDatabaseService.service);
  });

  const teamId = 'teamId' as TeamIdType;

  it('should return with undefined', async () => {

    mockDatabaseService.functions.deleteTeam.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.deleteTeam, teamId);
    expect.assertions(2);
  });

  it('should throw error if unable to delete team', async () => {
    mockDatabaseService.functions.deleteTeam.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to delete team', 500));
    validateFunctionCall(mockDatabaseService.functions.deleteTeam, teamId);
    expect.assertions(3);
  });
});
