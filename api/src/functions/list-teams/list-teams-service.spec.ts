import { IListTeamsService, listTeamsServiceFactory } from '@/functions/list-teams/list-teams-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IDatabaseService } from '@/services/database-service';
import { teamDocument, teamResponse } from '@/common/test-data-factory';

describe('List teams service', () => {
  let service: IListTeamsService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('listTeams');
    mockTeamDocumentConverter = createMockService('toResponseList');

    service = listTeamsServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  it('should return with list of teams', async () => {
    const queriedDocuments = [teamDocument()];
    mockDatabaseService.functions.listTeams.mockResolvedValue(queriedDocuments);

    const response = [teamResponse()];

    mockTeamDocumentConverter.functions.toResponseList.mockReturnValue(response);

    const result = await service();
    expect(result).toEqual(response);
    expect(mockDatabaseService.functions.listTeams).toHaveBeenCalledWith();
    validateFunctionCall(mockTeamDocumentConverter.functions.toResponseList, queriedDocuments);
  });

  it('should throw error if unable to query teams', async () => {
    mockDatabaseService.functions.listTeams.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to query teams', 500));
    expect(mockDatabaseService.functions.listTeams).toHaveBeenCalledWith();
    validateFunctionCall(mockTeamDocumentConverter.functions.toResponseList);
    expect.assertions(4);
  });
});
