import { IGetTeamService, getTeamServiceFactory } from '@foci2020/api/functions/get-team/get-team-service';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { teamDocument, teamResponse } from '@foci2020/shared/common/test-data-factory';

describe('Get team service', () => {
  let service: IGetTeamService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getTeamById');

    mockTeamDocumentConverter = createMockService('toResponse');

    service = getTeamServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  it('should return with a team', async () => {
    const teamId = 'teamId';
    const document = teamDocument();

    mockDatabaseService.functions.getTeamById.mockResolvedValue(document);

    const response = teamResponse();

    mockTeamDocumentConverter.functions.toResponse.mockReturnValue(response);

    const result = await service({ teamId });
    expect(result).toEqual(response);
    validateFunctionCall(mockDatabaseService.functions.getTeamById, teamId);
    validateFunctionCall(mockTeamDocumentConverter.functions.toResponse, document);
    expect.assertions(3);
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';
    mockDatabaseService.functions.getTeamById.mockRejectedValue('This is a dynamo error');

    await service({ teamId }).catch(validateError('Unable to query team', 500));
    validateFunctionCall(mockDatabaseService.functions.getTeamById, teamId);
    validateFunctionCall(mockTeamDocumentConverter.functions.toResponse);
    expect.assertions(4);
  });

  it('should return with error if no team found', async () => {
    const teamId = 'teamId';
    mockDatabaseService.functions.getTeamById.mockResolvedValue(undefined);

    await service({ teamId }).catch(validateError('No team found', 404));
    validateFunctionCall(mockDatabaseService.functions.getTeamById, teamId);
    validateFunctionCall(mockTeamDocumentConverter.functions.toResponse);
    expect.assertions(4);
  });
});
