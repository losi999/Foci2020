import { IListTournamentsService, listTournamentsServiceFactory } from '@foci2020/api/functions/list-tournaments/list-tournaments-service';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { tournamentDocument, tournamentResponse } from '@foci2020/shared/common/test-data-factory';

describe('List tournaments service', () => {
  let service: IListTournamentsService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('listTournaments');
    mockTournamentDocumentConverter = createMockService('toResponseList');

    service = listTournamentsServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with list of tournaments', async () => {
    const queriedDocuments = [tournamentDocument()];
    mockDatabaseService.functions.listTournaments.mockResolvedValue(queriedDocuments);

    const response = [tournamentResponse()];

    mockTournamentDocumentConverter.functions.toResponseList.mockReturnValueOnce(response);

    const result = await service();
    expect(result).toEqual(response);
    expect(mockDatabaseService.functions.listTournaments).toHaveBeenCalledWith();
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponseList, queriedDocuments);
  });

  it('should throw error if unable to query tournaments', async () => {
    mockDatabaseService.functions.listTournaments.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to query tournaments', 500));
    expect(mockDatabaseService.functions.listTournaments).toHaveBeenCalledWith();
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponseList);
    expect.assertions(4);
  });
});
