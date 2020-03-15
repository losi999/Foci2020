import { IListMatchesService, listMatchesServiceFactory } from '@/functions/list-matches/list-matches-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { MatchDocument, MatchResponse } from '@/types/types';

describe('List matches service', () => {
  let service: IListMatchesService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('listMatches');

    mockMatchDocumentConverter = createMockService('toResponseList');

    service = listMatchesServiceFactory(mockMatchDocumentService.service, mockMatchDocumentConverter.service);
  });

  it('should return with list of matches', async () => {
    const matchId1 = 'match1';
    const matchId2 = 'match2';
    const matchId3 = 'match3';
    const matchDocument1 = {
      id: matchId1,
    } as MatchDocument;
    const matchDocument2 = {
      id: matchId2,
    } as MatchDocument;
    const matchDocument3 = {
      id: matchId2,
    } as MatchDocument;
    const matchDocument4 = {
      id: matchId3,
    };

    const queriedDocuments: MatchDocument[] = [
      matchDocument1,
      matchDocument2,
      matchDocument3,
      matchDocument4] as MatchDocument[];
    mockMatchDocumentService.functions.listMatches.mockResolvedValue(queriedDocuments);

    const matchResponse = [
      {
        matchId: matchId1,
        startTime: 'date1'
      },
      {
        matchId: matchId2,
        startTime: 'date2'
      },
      {
        matchId: matchId3,
        startTime: 'date3'
      }
    ] as MatchResponse[];

    mockMatchDocumentConverter.functions.toResponseList.mockReturnValueOnce(matchResponse);

    const result = await service();
    expect(result).toEqual(matchResponse);
    expect(mockMatchDocumentService.functions.listMatches).toHaveBeenCalledWith();
    expect(mockMatchDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedDocuments);
  });

  it('should throw error if unable to query matches', async () => {
    mockMatchDocumentService.functions.listMatches.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to list matches', 500));
    expect(mockMatchDocumentService.functions.listMatches).toHaveBeenCalledWith();
    expect(mockMatchDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
