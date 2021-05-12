import { IDeleteMatchService, deleteMatchServiceFactory } from '@foci2020/api/functions/delete-match/delete-match-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { MatchIdType } from '@foci2020/shared/types/common';

describe('Delete match service', () => {
  let service: IDeleteMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;

  const matchId = 'matchId' as MatchIdType;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteMatch');

    service = deleteMatchServiceFactory(mockDatabaseService.service);
  });

  it('should return with undefined', async () => {
    mockDatabaseService.functions.deleteMatch.mockResolvedValue(undefined);

    const result = await service({
      matchId, 
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.deleteMatch, matchId);
  });

  it('should throw error if unable to delete match', async () => {
    mockDatabaseService.functions.deleteMatch.mockRejectedValue('This is a dynamo error');

    await service({
      matchId, 
    }).catch(validateError('Unable to delete match', 500));
    validateFunctionCall(mockDatabaseService.functions.deleteMatch, matchId);
    expect.assertions(3);
  });
});
