import { IGetMatchService, getMatchServiceFactory } from '@/functions/get-match/get-match-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { MatchDocument, MatchResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('Get match service', () => {
  let service: IGetMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getMatchById');
    mockMatchDocumentConverter = createMockService('toResponse');

    service = getMatchServiceFactory(mockDatabaseService.service, mockMatchDocumentConverter.service);
  });

  it('should return with a match', async () => {
    const matchId = 'matchId';
    const matchDocument = {
      id: matchId,
    } as MatchDocument;

    mockDatabaseService.functions.getMatchById.mockResolvedValue(matchDocument);

    const matchResponse = {
      matchId,
    } as MatchResponse;

    mockMatchDocumentConverter.functions.toResponse.mockReturnValue(matchResponse);

    const result = await service({ matchId });
    expect(result).toEqual(matchResponse);
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).toHaveBeenCalledWith(matchDocument);
  });

  it('should throw error if unable to query match', async () => {
    const matchId = 'matchId';
    mockDatabaseService.functions.getMatchById.mockRejectedValue('This is a dynamo error');

    await service({ matchId }).catch(validateError('Unable to query match', 500));
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no match found', async () => {
    const matchId = 'matchId';
    mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

    await service({ matchId }).catch(validateError('No match found', 404));
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
