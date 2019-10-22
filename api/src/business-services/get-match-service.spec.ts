import { IDatabaseService } from '@/services/database-service';
import { IGetMatchService, getMatchServiceFactory } from '@/business-services/get-match-service';
import { MatchDetailsDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';

describe('Get match service', () => {
  let service: IGetMatchService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchById: jest.Mock;
  let mockConverter: jest.Mock;

  beforeEach(() => {
    mockQueryMatchById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryMatchById: mockQueryMatchById,
    }))) as IDatabaseService;

    mockConverter = jest.fn();

    service = getMatchServiceFactory(mockDatabaseService, mockConverter);
  });

  it('should return with a match', async () => {
    const matchId = 'matchId';
    const matchDocument = {
      matchId,
      segment: 'details',
    } as MatchDetailsDocument;

    mockQueryMatchById.mockResolvedValue([matchDocument]);

    const matchResponse = {
      matchId,
    } as MatchResponse;

    mockConverter.mockReturnValueOnce(matchResponse);

    const result = await service({ matchId });
    expect(result).toEqual(matchResponse);
    expect(mockConverter).toHaveBeenCalledWith([matchDocument]);
  });

  it('should throw error if unable to query match', async () => {
    const matchId = 'matchId';
    mockQueryMatchById.mockRejectedValue('This is a dynamo error');

    try {
      await service({ matchId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query match');
    }
  });
});
