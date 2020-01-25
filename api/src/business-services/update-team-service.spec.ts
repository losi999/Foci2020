import { IUpdateTeamService, updateTeamServiceFactory } from '@/business-services/update-team-service';
import { TeamRequest } from '@/types/requests';
import { INotificationService } from '@/services/notification-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { Mock, createMockService, validateError } from '@/common';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamDocumentUpdatable, TeamDocument } from '@/types/documents';

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
    } as TeamDocumentUpdatable;

    const updated = {
      image,
      shortName,
      teamName
    } as TeamDocument;

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockTeamDocumentService.functions.updateTeam.mockResolvedValue(updated);
    mockNotificationService.functions.teamUpdated.mockResolvedValue(undefined);

    const result = await service({
      teamId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(body);
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(teamId, converted);
    expect(mockNotificationService.functions.teamUpdated).toHaveBeenCalledWith({
      teamId,
      team: updated
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
    } as TeamDocumentUpdatable;

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockTeamDocumentService.functions.updateTeam.mockRejectedValue('This is a dynamo error');

    await service({
      teamId,
      body
    }).catch(validateError('Error while updating team', 500));
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(body);
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
    } as TeamDocumentUpdatable;

    const updated = {
      image,
      shortName,
      teamName
    } as TeamDocument;

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockTeamDocumentService.functions.updateTeam.mockResolvedValue(updated);
    mockNotificationService.functions.teamUpdated.mockRejectedValue('This is an SNS error');

    await service({
      teamId,
      body
    }).catch(validateError('Unable to send team updated notification', 500));
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(body);
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(teamId, converted);
    expect(mockNotificationService.functions.teamUpdated).toHaveBeenCalledWith({
      teamId,
      team: updated
    });
    expect.assertions(5);
  });
});
