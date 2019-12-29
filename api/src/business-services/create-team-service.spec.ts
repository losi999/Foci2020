import { createTeamServiceFactory, ICreateTeamService } from '@/business-services/create-team-service';
import { TeamRequest } from '@/types/requests';
import { ITeamDocumentService } from '@/services/team-document-service';
import { Mock, createMockService, validateError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamDocument } from '@/types/documents';

describe('Create team service', () => {
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;
  let service: ICreateTeamService;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('saveTeam');
    mockTeamDocumentConverter = createMockService('create');

    service = createTeamServiceFactory(mockTeamDocumentService.service, mockTeamDocumentConverter.service);
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
    mockTeamDocumentService.functions.saveTeam.mockRejectedValue({});

    await service({ body }).catch(validateError('Error while saving team', 500));

    expect(mockTeamDocumentConverter.functions.create).toHaveBeenCalledWith(body);
    expect(mockTeamDocumentService.functions.saveTeam).toHaveBeenCalledWith(convertedTeam);
  });

  it('should return with teamId if team is saved', async () => {
    const { body, teamId, convertedTeam } = setup();

    mockTeamDocumentConverter.functions.create.mockReturnValue(convertedTeam);
    mockTeamDocumentService.functions.saveTeam.mockResolvedValue(undefined);

    const result = await service({ body });

    expect(result).toEqual(teamId);
    expect(mockTeamDocumentConverter.functions.create).toHaveBeenCalledWith(body);
    expect(mockTeamDocumentService.functions.saveTeam).toHaveBeenCalledWith(convertedTeam);
  });
});
