import { IGetMatchService, getMatchServiceFactory } from '@foci2020/api/functions/get-match/get-match-service';
import { IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument, matchResponse } from '@foci2020/shared/common/test-data-factory';

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
    const document = matchDocument();

    mockDatabaseService.functions.getMatchById.mockResolvedValue(document);

    const response = matchResponse();

    mockMatchDocumentConverter.functions.toResponse.mockReturnValue(response);

    const result = await service({ matchId });
    expect(result).toEqual(response);
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponse, document);
    expect.assertions(3);
  });

  it('should throw error if unable to query match', async () => {
    const matchId = 'matchId';
    mockDatabaseService.functions.getMatchById.mockRejectedValue('This is a dynamo error');

    await service({ matchId }).catch(validateError('Unable to query match', 500));
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponse);
    expect.assertions(4);
  });

  it('should return with error if no match found', async () => {
    const matchId = 'matchId';
    mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

    await service({ matchId }).catch(validateError('No match found', 404));
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponse);
    expect.assertions(4);
  });
});
