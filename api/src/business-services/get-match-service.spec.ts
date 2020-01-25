import { IGetMatchService, getMatchServiceFactory } from '@/business-services/get-match-service';
import { MatchDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('Get match service', () => {
  let service: IGetMatchService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchById');
    mockMatchDocumentConverter = createMockService('toResponse');

    service = getMatchServiceFactory(mockMatchDocumentService.service, mockMatchDocumentConverter.service);
  });

  it('should return with a match', async () => {
    const matchId = 'matchId';
    const matchDocument = {
      id: matchId,
    } as MatchDocument;

    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(matchDocument);

    const matchResponse = {
      matchId,
    } as MatchResponse;

    mockMatchDocumentConverter.functions.toResponse.mockReturnValue(matchResponse);

    const result = await service({ matchId });
    expect(result).toEqual(matchResponse);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).toHaveBeenCalledWith(matchDocument);
  });

  it('should throw error if unable to query match', async () => {
    const matchId = 'matchId';
    mockMatchDocumentService.functions.queryMatchById.mockRejectedValue('This is a dynamo error');

    await service({ matchId }).catch(validateError('Unable to query match', 500));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no match found', async () => {
    const matchId = 'matchId';
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(undefined);

    await service({ matchId }).catch(validateError('No match found', 404));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
