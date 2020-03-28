import { IDeleteMatchService, deleteMatchServiceFactory } from '@/functions/delete-match/delete-match-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IDatabaseService } from '@/services/database-service';

describe('Delete match service', () => {
  let service: IDeleteMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;

  const matchId = 'matchId';

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteMatch');

    service = deleteMatchServiceFactory(mockDatabaseService.service);
  });

  it('should return with undefined', async () => {
    mockDatabaseService.functions.deleteMatch.mockResolvedValue(undefined);

    const result = await service({ matchId });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.deleteMatch, matchId);
  });

  it('should throw error if unable to delete match', async () => {
    mockDatabaseService.functions.deleteMatch.mockRejectedValue('This is a dynamo error');

    await service({ matchId }).catch(validateError('Unable to delete match', 500));
    validateFunctionCall(mockDatabaseService.functions.deleteMatch, matchId);
    expect.assertions(3);
  });
});
