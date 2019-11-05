import { IUpdateTeamService, updateTeamServiceFactory } from '@/business-services/update-team-service';
import { TeamRequest } from '@/types/requests';
import { INotificationService } from '@/services/notification-service';
import { ITeamDocumentService } from '@/services/team-document-service';

describe('Update team service', () => {
  let service: IUpdateTeamService;
  let mockTeamDocumentService: ITeamDocumentService;
  let mockUpdateTeam: jest.Mock;
  let mockNotificationService: INotificationService;
  let mockTeamUpdated: jest.Mock;

  beforeEach(() => {
    mockUpdateTeam = jest.fn();
    mockTeamDocumentService = new (jest.fn<Partial<ITeamDocumentService>, undefined[]>(() => ({
      updateTeam: mockUpdateTeam
    }))) as ITeamDocumentService;

    mockTeamUpdated = jest.fn();
    mockNotificationService = new (jest.fn<Partial<INotificationService>, undefined[]>(() => ({
      teamUpdated: mockTeamUpdated
    })))() as INotificationService;

    service = updateTeamServiceFactory(mockTeamDocumentService, mockNotificationService);
  });

  it('should return with with undefined if team is updated successfully', async () => {
    const teamId = 'teamId';
    const teamName = 'teamName';
    const image = 'http://image.com/a.png';
    const shortName = 'SHN';
    const body: TeamRequest = {
      teamName,
      image,
      shortName
    };

    mockUpdateTeam.mockResolvedValue(undefined);
    mockTeamUpdated.mockResolvedValue(undefined);

    const result = await service({
      teamId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockUpdateTeam).toHaveBeenCalledWith(teamId, body);
  });

  it('should throw error if unable to update team', async () => {
    const teamId = 'teamId';
    const teamName = 'teamName';
    const image = 'http://image.com/a.png';
    const shortName = 'SHN';
    const body: TeamRequest = {
      teamName,
      image,
      shortName
    };

    mockUpdateTeam.mockRejectedValue('This is a dynamo error');

    try {
      await service({
        teamId,
        body
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while updating team');
    }
  });

  it('should throw error if unable to send notification', async () => {
    const teamId = 'teamId';
    const teamName = 'teamName';
    const image = 'http://image.com/a.png';
    const shortName = 'SHN';
    const body: TeamRequest = {
      teamName,
      image,
      shortName
    };

    mockUpdateTeam.mockResolvedValue(undefined);
    mockTeamUpdated.mockRejectedValue('This is an SNS error');

    try {
      await service({
        teamId,
        body
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to send team updated notification');
    }
  });
});
