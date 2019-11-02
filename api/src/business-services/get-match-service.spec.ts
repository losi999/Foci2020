import { IDatabaseService } from '@/services/database-service';
import { IGetMatchService, getMatchServiceFactory } from '@/business-services/get-match-service';
import { MatchDetailsDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';

describe('Get match service', () => {
  let service: IGetMatchService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchById: jest.Mock;
  let mockMatchDocumentConverter: IMatchDocumentConverter;
  let mockCreateResponse: jest.Mock;

  beforeEach(() => {
    mockQueryMatchById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryMatchById: mockQueryMatchById,
    }))) as IDatabaseService;

    mockCreateResponse = jest.fn();
    mockMatchDocumentConverter = new (jest.fn<Partial<IMatchDocumentConverter>, undefined[]>(() => ({
      createResponse: mockCreateResponse
    })))() as IMatchDocumentConverter;

    service = getMatchServiceFactory(mockDatabaseService, mockMatchDocumentConverter);
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

    mockCreateResponse.mockReturnValue(matchResponse);

    const result = await service({ matchId });
    expect(result).toEqual(matchResponse);
    expect(mockCreateResponse).toHaveBeenCalledWith([matchDocument]);
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
