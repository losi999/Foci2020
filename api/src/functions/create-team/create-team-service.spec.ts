import { createTeamServiceFactory, ICreateTeamService } from '@/functions/create-team/create-team-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamDocument, TeamRequest } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('Create team service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;
  let service: ICreateTeamService;

  beforeEach(() => {
    mockDatabaseService = createMockService('saveTeam');
    mockTeamDocumentConverter = createMockService('create');

    service = createTeamServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  type TestDataInput = {
    teamId: string;
    convertedTeam: TeamDocument,
  };

  type TestData = TestDataInput & {
    body: TeamRequest,
  };

  const setup = (input?: Partial<TestDataInput> & { minutesFromNow?: number }): TestData => {
    const teamId = input?.teamId ?? 'teamId';

    const convertedTeam = input?.convertedTeam ?? {
      id: teamId
    } as TeamDocument;

    return {
      convertedTeam,
      teamId,
      body: {
        teamName: 'teamName'
      } as TeamRequest
    };
  };

  it('should throw error if unable to save team', async () => {
    const { body, convertedTeam } = setup();

    mockTeamDocumentConverter.functions.create.mockReturnValue(convertedTeam);
    mockDatabaseService.functions.saveTeam.mockRejectedValue({});

    await service({ body }).catch(validateError('Error while saving team', 500));

    expect(mockTeamDocumentConverter.functions.create).toHaveBeenCalledWith(body);
    expect(mockDatabaseService.functions.saveTeam).toHaveBeenCalledWith(convertedTeam);
    expect.assertions(4);
  });

  it('should return with teamId if team is saved', async () => {
    const { body, teamId, convertedTeam } = setup();

    mockTeamDocumentConverter.functions.create.mockReturnValue(convertedTeam);
    mockDatabaseService.functions.saveTeam.mockResolvedValue(undefined);

    const result = await service({ body });

    expect(result).toEqual(teamId);
    expect(mockTeamDocumentConverter.functions.create).toHaveBeenCalledWith(body);
    expect(mockDatabaseService.functions.saveTeam).toHaveBeenCalledWith(convertedTeam);
  });
});
