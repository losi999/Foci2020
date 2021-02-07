import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument, tournamentDocument } from '@foci2020/shared/common/test-data-factory';
import { TournamentIdType } from '@foci2020/shared/types/common';
import { ITournamentUpdatedService, tournamentUpdatedServiceFactory } from '@foci2020/api/functions/tournament-updated/tournament-updated-service';

describe('Tournament updated service', () => {
  let service: ITournamentUpdatedService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('updateTournamentOfMatch', 'queryMatchesByTournamentId');

    service = tournamentUpdatedServiceFactory(mockDatabaseService.service);
  });

  const tournamentId = 'tournamentId' as TournamentIdType;
  const tournament = tournamentDocument();
  const queriedMatch = matchDocument();
  const dynamoErrorMessage = 'This is a dynamo error';

  it('should return undefined if matches are updated sucessfully', async () => {
    mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);
    mockDatabaseService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

    const result = await service({
      tournament, 
    });

    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
    validateFunctionCall(mockDatabaseService.functions.updateTournamentOfMatch, queriedMatch['documentType-id'], tournament);
    expect.assertions(3);
  });

  describe('should throw error', () => {
    it('if unable to query matches by tournament Id', async () => {
      mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue({
        message: dynamoErrorMessage, 
      });

      await service({
        tournament, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.updateTournamentOfMatch);
      expect.assertions(3);
    });

    it('if unable to update matches', async () => {
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);
      mockDatabaseService.functions.updateTournamentOfMatch.mockRejectedValue({
        message: dynamoErrorMessage, 
      });

      await service({
        tournament, 
      }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.updateTournamentOfMatch, queriedMatch['documentType-id'], tournament);
      expect.assertions(3);
    });
  });
});
