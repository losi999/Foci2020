import { IGetMatchService, getMatchServiceFactory } from '@/business-services/get-match-service';
import { MatchDetailsDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';

describe('Get match service', () => {
  let service: IGetMatchService;
  let mockMatchDocumentService: IMatchDocumentService;
  let mockQueryMatchById: jest.Mock;
  let mockMatchDocumentConverter: IMatchDocumentConverter;
  let mockCreateResponse: jest.Mock;

  beforeEach(() => {
    mockQueryMatchById = jest.fn();
    mockMatchDocumentService = new (jest.fn<Partial<IMatchDocumentService>, undefined[]>(() => ({
      queryMatchById: mockQueryMatchById,
    }))) as IMatchDocumentService;

    mockCreateResponse = jest.fn();
    mockMatchDocumentConverter = new (jest.fn<Partial<IMatchDocumentConverter>, undefined[]>(() => ({
      createResponse: mockCreateResponse
    })))() as IMatchDocumentConverter;

    service = getMatchServiceFactory(mockMatchDocumentService, mockMatchDocumentConverter);
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
