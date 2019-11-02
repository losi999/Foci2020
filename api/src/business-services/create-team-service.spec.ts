import { createTeamServiceFactory, ICreateTeamService } from '@/business-services/create-team-service';
import { TeamRequest } from '@/types/requests';
import { ITeamDocumentService } from '@/services/team-document-service';
describe('Create team service', () => {
  let mockTeamDocumentService: ITeamDocumentService;
  let mockSaveTeam: jest.Mock;
  let mockUuid: jest.Mock;
  let service: ICreateTeamService;

  const teamId = 'uuid';

  beforeEach(() => {
    mockSaveTeam = jest.fn();
    mockTeamDocumentService = new (jest.fn<Partial<ITeamDocumentService>, undefined[]>(() => ({
      saveTeam: mockSaveTeam
    })))() as ITeamDocumentService;

    mockUuid = jest.fn();

    service = createTeamServiceFactory(mockTeamDocumentService, mockUuid);
  });

  it('should throw error if unable to save team', async () => {
    const body = {} as TeamRequest;
    mockUuid.mockReturnValue(teamId);
    mockSaveTeam.mockRejectedValue({});
    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while saving team');
    }
  });

  it('should return undefined if team is saved', async () => {
    const teamName = 'teamName';
    const body = { teamName } as TeamRequest;
    mockUuid.mockReturnValue(teamId);
    mockSaveTeam.mockResolvedValue(undefined);
    const result = await service({ body });
    expect(result).toBeUndefined();
    expect(mockSaveTeam).toHaveBeenCalledWith(teamId, body);
  });
});
