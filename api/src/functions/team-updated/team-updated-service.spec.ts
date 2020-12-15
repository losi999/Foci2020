import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { teamDocument } from '@foci2020/shared/common/test-data-factory';
import { DocumentKey } from '@foci2020/shared/types/documents';
import { KeyType } from '@foci2020/shared/types/common';
import { ITeamUpdatedService, teamUpdatedServiceFactory } from '@foci2020/api/functions/team-updated/team-updated-service';

describe('Team updated service', () => {
  let service: ITeamUpdatedService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('updateTeamOfMatch', 'queryMatchKeysByAwayTeamId', 'queryMatchKeysByHomeTeamId');

    service = teamUpdatedServiceFactory(mockDatabaseService.service);
  });

  const matchKey1 = 'match#1' as KeyType;
  const matchKey2 = 'match#2' as KeyType;
  const team = teamDocument();
  const queriedHomeMatches: DocumentKey[] = [{
    'documentType-id': matchKey1
  }];
  const queriedAwayMatches: DocumentKey[] = [{
    'documentType-id': matchKey2
  }];
  const dynamoErrorMessage = 'This is a dynamo error';

  it('should return undefined if matches are updated successfully', async () => {
    mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
    mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
    mockDatabaseService.functions.updateTeamOfMatch.mockResolvedValue(undefined);

    const result = await service({ team });

    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
    validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
    expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchKey1, team, 'home');
    expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchKey2, team, 'away');
    expect.assertions(5);
  });

  describe('should throw error', () => {
    it('if unable to query matches by homeTeam Id', async () => {
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message: dynamoErrorMessage });
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

      await service({ team }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
      validateFunctionCall(mockDatabaseService.functions.updateTeamOfMatch);
      expect.assertions(4);
    });

    it('if unable to query matches by awayTeam Id', async () => {
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message: dynamoErrorMessage });

      await service({ team }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
      validateFunctionCall(mockDatabaseService.functions.updateTeamOfMatch);
      expect.assertions(4);
    });

    it('if unable to update matches', async () => {
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockDatabaseService.functions.updateTeamOfMatch.mockRejectedValue({ message: dynamoErrorMessage });

      await service({ team }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchKey1, team, 'home');
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchKey2, team, 'away');
      expect.assertions(5);
    });
  });
});
