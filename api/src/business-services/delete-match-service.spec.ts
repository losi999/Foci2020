import { IDeleteMatchService, deleteMatchServiceFactory } from '@/business-services/delete-match-service';
import { IMatchDocumentService } from '@/services/match-document-service';

describe('Delete match service', () => {
  let service: IDeleteMatchService;
  let mockMatchDocumentService: IMatchDocumentService;
  let mockDeleteMatch: jest.Mock;

  beforeEach(() => {
    mockDeleteMatch = jest.fn();
    mockMatchDocumentService = new (jest.fn<Partial<IMatchDocumentService>, undefined[]>(() => ({
      deleteMatch: mockDeleteMatch,
    }))) as IMatchDocumentService;

    service = deleteMatchServiceFactory(mockMatchDocumentService);
  });

  it('should return with undefined', async () => {
    const matchId = 'matchId';

    mockDeleteMatch.mockResolvedValue(undefined);

    const result = await service({ matchId });
    expect(result).toBeUndefined();
  });

  it('should throw error if unable to query match', async () => {
    const matchId = 'matchId';

    mockDeleteMatch.mockRejectedValue('This is a dynamo error');

    try {
      await service({ matchId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to delete match');
    }
  });
});
