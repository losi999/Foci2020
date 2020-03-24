import { IUpdateTeamService, updateTeamServiceFactory } from '@/functions/update-team/update-team-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { TeamRequest, TeamDocument } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('Update team service', () => {
  let service: IUpdateTeamService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('updateTeam');
    mockTeamDocumentConverter = createMockService('update');

    service = updateTeamServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
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
    mockDatabaseService.functions.updateTeam.mockResolvedValue(undefined);

    const result = await service({
      teamId,
      body
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockTeamDocumentConverter.functions.update, teamId, body);
    validateFunctionCall(mockDatabaseService.functions.updateTeam, converted);
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
    mockDatabaseService.functions.updateTeam.mockRejectedValue('This is a dynamo error');

    await service({
      teamId,
      body
    }).catch(validateError('Error while updating team', 500));
    validateFunctionCall(mockTeamDocumentConverter.functions.update, teamId, body);
    validateFunctionCall(mockDatabaseService.functions.updateTeam, converted);
    expect.assertions(4);
  });
});
