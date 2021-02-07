import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { DocumentKey } from '@foci2020/shared/types/documents';
import { TeamIdType, KeyType } from '@foci2020/shared/types/common';
import { ITeamDeletedService, teamDeletedServiceFactory } from '@foci2020/api/functions/team-deleted/team-deleted-service';

describe('Team deleted service', () => {
  let service: ITeamDeletedService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteDocuments', 'queryMatchKeysByAwayTeamId', 'queryMatchKeysByHomeTeamId');

    service = teamDeletedServiceFactory(mockDatabaseService.service);
  });

  const teamId = 'teamId' as TeamIdType;
  const matchKey1 = 'match#1' as KeyType;
  const matchKey2 = 'match#2' as KeyType;
  const queriedHomeMatches: DocumentKey[] = [{
    'documentType-id': matchKey1, 
  }];
  const queriedAwayMatches: DocumentKey[] = [{
    'documentType-id': matchKey2, 
  }];
  const dynamoErrorMessage = 'This is a dynamo error';

  it('should return undefined if matches are deleted successfully', async () => {
    mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
    mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
    mockDatabaseService.functions.deleteDocuments.mockResolvedValue(undefined);

    const result = await service({
      teamId, 
    });

    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
    validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
    validateFunctionCall(mockDatabaseService.functions.deleteDocuments, [matchKey1, matchKey2]);
    expect.assertions(4);
  });

  describe('should throw error', () => {
    it('if unable to query matches by homeTeam Id', async () => {
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({
        message: dynamoErrorMessage, 
      });
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

      await service({
        teamId, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments);
      expect.assertions(4);
    });

    it('if unable to query matches by awayTeam Id', async () => {
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({
        message: dynamoErrorMessage, 
      });

      await service({
        teamId, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments);
      expect.assertions(4);
    });

    it('if unable to delete matches', async () => {
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockDatabaseService.functions.deleteDocuments.mockRejectedValue({
        message: dynamoErrorMessage, 
      });

      await service({
        teamId, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments, [matchKey1, matchKey2]);
      expect.assertions(4);
    });
  });
});
