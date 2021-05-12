import { IUpdateTeamService, updateTeamServiceFactory } from '@foci2020/api/functions/update-team/update-team-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { ITeamDocumentConverter } from '@foci2020/shared/converters/team-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { teamRequest, teamDocument } from '@foci2020/shared/common/test-data-factory';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('Update team service', () => {
  let service: IUpdateTeamService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;
  const expiresIn = 30;

  beforeEach(() => {
    mockDatabaseService = createMockService('updateTeam');
    mockTeamDocumentConverter = createMockService('update');

    service = updateTeamServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  const teamId = 'teamId' as TeamIdType;

  it('should return with with undefined if team is updated successfully', async () => {
    const body = teamRequest();

    const converted = teamDocument();

    mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
    mockDatabaseService.functions.updateTeam.mockResolvedValue(undefined);

    const result = await service({
      teamId,
      body,
      expiresIn,
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockTeamDocumentConverter.functions.update, teamId, body, expiresIn);
    validateFunctionCall(mockDatabaseService.functions.updateTeam, converted);
    expect.assertions(3);
  });

  describe('should throw error', () => {
    it('if no team found', async () => {
      const body = teamRequest();

      const converted = teamDocument();

      mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
      mockDatabaseService.functions.updateTeam.mockRejectedValue({
        code: 'ConditionalCheckFailedException', 
      });

      await service({
        teamId,
        body,
        expiresIn,
      }).catch(validateError('No team found', 404));
      validateFunctionCall(mockTeamDocumentConverter.functions.update, teamId, body, expiresIn);
      validateFunctionCall(mockDatabaseService.functions.updateTeam, converted);
      expect.assertions(4);
    });

    it('if unable to update team', async () => {
      const body = teamRequest();

      const converted = teamDocument();

      mockTeamDocumentConverter.functions.update.mockReturnValue(converted);
      mockDatabaseService.functions.updateTeam.mockRejectedValue('This is a dynamo error');

      await service({
        teamId,
        body,
        expiresIn,
      }).catch(validateError('Error while updating team', 500));
      validateFunctionCall(mockTeamDocumentConverter.functions.update, teamId, body, expiresIn);
      validateFunctionCall(mockDatabaseService.functions.updateTeam, converted);
      expect.assertions(4);
    });
  });
});
