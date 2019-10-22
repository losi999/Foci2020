import { IDatabaseService } from '@/services/database-service';
import { IDeleteMatchService, deleteMatchServiceFactory } from '@/business-services/delete-match-service';

describe('Delete match service', () => {
  let service: IDeleteMatchService;
  let mockDatabaseService: IDatabaseService;
  let mockDeleteMatch: jest.Mock;

  beforeEach(() => {
    mockDeleteMatch = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      deleteMatch: mockDeleteMatch,
    }))) as IDatabaseService;

    service = deleteMatchServiceFactory(mockDatabaseService);
  });

  it('should return with a match', async () => {
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
