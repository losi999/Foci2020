import { IUpdateTeamService, updateTeamServiceFactory } from '@/team/update-team/update-team-service';
import { INotificationService } from '@/shared/services/notification-service';
import { ITeamDocumentService } from '@/team/team-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { ITeamDocumentConverter } from '@/team/team-document-converter';
import { TeamRequest, TeamDocument } from '@/shared/types/types';

describe('Update team service', () => {
  let service: IUpdateTeamService;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;
  let mockNotificationService: Mock<INotificationService>;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('updateTeam');
    mockTeamDocumentConverter = createMockService('update');
    mockNotificationService = createMockService('teamUpdated');

    service = updateTeamServiceFactory(mockTeamDocumentService.service, mockTeamDocumentConverter.service, mockNotificationService.service);
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

    const converted = {
      image,
      shortName,
      teamName
    } as TeamDocument;

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockTeamDocumentService.functions.updateTeam.mockResolvedValue(undefined);
    mockNotificationService.functions.teamUpdated.mockResolvedValue(undefined);

    const result = await service({
      teamId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(teamId, body);
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(teamId, converted);
    expect(mockNotificationService.functions.teamUpdated).toHaveBeenCalledWith({
      teamId,
      team: converted
    });
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

    const converted = {
      image,
      shortName,
      teamName
    } as TeamDocument;

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockTeamDocumentService.functions.updateTeam.mockRejectedValue('This is a dynamo error');

    await service({
      teamId,
      body
    }).catch(validateError('Error while updating team', 500));
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(teamId, body);
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(teamId, converted);
    expect(mockNotificationService.functions.teamUpdated).not.toHaveBeenCalled();
    expect.assertions(5);
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

    const converted = {
      image,
      shortName,
      teamName
    } as TeamDocument;

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockTeamDocumentService.functions.updateTeam.mockResolvedValue(undefined);
    mockNotificationService.functions.teamUpdated.mockRejectedValue('This is an SNS error');

    await service({
      teamId,
      body
    }).catch(validateError('Unable to send team updated notification', 500));
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(teamId, body);
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(teamId, converted);
    expect(mockNotificationService.functions.teamUpdated).toHaveBeenCalledWith({
      teamId,
      team: converted
    });
    expect.assertions(5);
  });
});
