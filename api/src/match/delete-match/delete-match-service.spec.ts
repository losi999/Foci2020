import { IDeleteMatchService, deleteMatchServiceFactory } from '@/match/delete-match/delete-match-service';
import { IMatchDocumentService } from '@/match/match-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';

describe('Delete match service', () => {
  let service: IDeleteMatchService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  const matchId = 'matchId';

  beforeEach(() => {
    mockMatchDocumentService = createMockService('deleteMatch');

    service = deleteMatchServiceFactory(mockMatchDocumentService.service);
  });

  it('should return with undefined', async () => {
    mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

    const result = await service({ matchId });
    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenCalledWith(matchId);
  });

  it('should throw error if unable to delete match', async () => {
    mockMatchDocumentService.functions.deleteMatch.mockRejectedValue('This is a dynamo error');

    await service({ matchId }).catch(validateError('Unable to delete match', 500));
    expect.assertions(3);
    expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenCalledWith(matchId);
  });
});
