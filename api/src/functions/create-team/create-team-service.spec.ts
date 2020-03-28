import { createTeamServiceFactory, ICreateTeamService } from '@/functions/create-team/create-team-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { IDatabaseService } from '@/services/database-service';
import { teamRequest, teamDocument } from '@/converters/test-data-factory';

describe('Create team service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;
  let service: ICreateTeamService;

  beforeEach(() => {
    mockDatabaseService = createMockService('saveTeam');
    mockTeamDocumentConverter = createMockService('create');

    service = createTeamServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  it('should throw error if unable to save team', async () => {
    const convertedTeam = teamDocument();
    const body = teamRequest();

    mockTeamDocumentConverter.functions.create.mockReturnValue(convertedTeam);
    mockDatabaseService.functions.saveTeam.mockRejectedValue({});

    await service({ body }).catch(validateError('Error while saving team', 500));

    validateFunctionCall(mockTeamDocumentConverter.functions.create, body);
    validateFunctionCall(mockDatabaseService.functions.saveTeam, convertedTeam);
    expect.assertions(4);
  });

  it('should return with teamId if team is saved', async () => {
    const convertedTeam = teamDocument();
    const body = teamRequest();

    mockTeamDocumentConverter.functions.create.mockReturnValue(convertedTeam);
    mockDatabaseService.functions.saveTeam.mockResolvedValue(undefined);

    const result = await service({ body });

    expect(result).toEqual(convertedTeam.id);
    validateFunctionCall(mockTeamDocumentConverter.functions.create, body);
    validateFunctionCall(mockDatabaseService.functions.saveTeam, convertedTeam);
    expect.assertions(3);
  });
});
