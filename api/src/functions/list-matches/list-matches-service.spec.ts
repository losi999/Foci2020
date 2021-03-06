import { IListMatchesService, listMatchesServiceFactory } from '@foci2020/api/functions/list-matches/list-matches-service';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument, matchResponse } from '@foci2020/shared/common/test-data-factory';

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
    const queriedDocuments = [matchDocument()];
    mockDatabaseService.functions.listMatches.mockResolvedValue(queriedDocuments);

    const response = [matchResponse()];

    mockMatchDocumentConverter.functions.toResponseList.mockReturnValueOnce(response);

    const result = await service();
    expect(result).toEqual(response);
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
