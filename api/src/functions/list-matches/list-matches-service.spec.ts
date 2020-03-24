import { IListMatchesService, listMatchesServiceFactory } from '@/functions/list-matches/list-matches-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { MatchDocument, MatchResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('List matches service', () => {
  let service: IListMatchesService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('listMatches');

    mockMatchDocumentConverter = createMockService('toResponseList');

    service = listMatchesServiceFactory(mockDatabaseService.service, mockMatchDocumentConverter.service);
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
    mockDatabaseService.functions.listMatches.mockResolvedValue(queriedDocuments);

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
    expect(mockDatabaseService.functions.listMatches).toHaveBeenCalledWith();
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponseList, queriedDocuments);
  });

  it('should throw error if unable to query matches', async () => {
    mockDatabaseService.functions.listMatches.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to list matches', 500));
    expect(mockDatabaseService.functions.listMatches).toHaveBeenCalledWith();
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponseList);
    expect.assertions(4);
  });
});
