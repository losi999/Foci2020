import { IUpdateTeamService, updateTeamServiceFactory } from '@/functions/update-team/update-team-service';
import { ITeamDocumentService } from '@/services/team-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamRequest, TeamDocument } from '@/types/types';

describe('Update team service', () => {
  let service: IUpdateTeamService;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('updateTeam');
    mockTeamDocumentConverter = createMockService('update');

    service = updateTeamServiceFactory(mockTeamDocumentService.service, mockTeamDocumentConverter.service);
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

    const result = await service({
      teamId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockTeamDocumentConverter.functions.update).toHaveBeenCalledWith(teamId, body);
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(converted);
    expect.assertions(3);
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
    expect(mockTeamDocumentService.functions.updateTeam).toHaveBeenCalledWith(converted);
    expect.assertions(4);
  });
});
