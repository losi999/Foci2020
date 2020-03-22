import { IGetMatchService, getMatchServiceFactory } from '@/functions/get-match/get-match-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { MatchDocument, MatchResponse } from '@/types/types';

describe('Get match service', () => {
  let service: IGetMatchService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('getMatchById');
    mockMatchDocumentConverter = createMockService('toResponse');

    service = getMatchServiceFactory(mockMatchDocumentService.service, mockMatchDocumentConverter.service);
  });

  it('should return with a match', async () => {
    const matchId = 'matchId';
    const matchDocument = {
      id: matchId,
    } as MatchDocument;

    mockMatchDocumentService.functions.getMatchById.mockResolvedValue(matchDocument);

    const matchResponse = {
      matchId,
    } as MatchResponse;

    mockMatchDocumentConverter.functions.toResponse.mockReturnValue(matchResponse);

    const result = await service({ matchId });
    expect(result).toEqual(matchResponse);
    expect(mockMatchDocumentService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).toHaveBeenCalledWith(matchDocument);
  });

  it('should throw error if unable to query match', async () => {
    const matchId = 'matchId';
    mockMatchDocumentService.functions.getMatchById.mockRejectedValue('This is a dynamo error');

    await service({ matchId }).catch(validateError('Unable to query match', 500));
    expect(mockMatchDocumentService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no match found', async () => {
    const matchId = 'matchId';
    mockMatchDocumentService.functions.getMatchById.mockResolvedValue(undefined);

    await service({ matchId }).catch(validateError('No match found', 404));
    expect(mockMatchDocumentService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
