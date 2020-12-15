import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument } from '@foci2020/shared/common/test-data-factory';
import { TournamentIdType } from '@foci2020/shared/types/common';
import { ITournamentDeletedService, tournamentDeletedServiceFactory } from '@foci2020/api/functions/tournament-deleted/tournament-deleted-service';

describe('Tournament deleted service', () => {
  let service: ITournamentDeletedService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteDocuments', 'queryMatchesByTournamentId');

    service = tournamentDeletedServiceFactory(mockDatabaseService.service);
  });

  const queriedMatch = matchDocument();
  const tournamentId = 'tournamentId' as TournamentIdType;
  const dynamoErrorMessage = 'This is a dynamo error';

  it('should return undefined if matches are deleted sucessfully', async () => {
    mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);
    mockDatabaseService.functions.deleteDocuments.mockResolvedValue(undefined);

    const result = await service({ tournamentId });

    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
    validateFunctionCall(mockDatabaseService.functions.deleteDocuments, [queriedMatch['documentType-id']]);
    expect.assertions(3);
  });

  describe('should throw error', () => {
    it('if unable to query matches by tournament Id', async () => {
      mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue({ message: dynamoErrorMessage });

      await service({ tournamentId }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments);
      expect.assertions(3);
    });

    it('if unable to delete matches', async () => {
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);
      mockDatabaseService.functions.deleteDocuments.mockRejectedValue({ message: dynamoErrorMessage });

      await service({ tournamentId }).catch(validateError(dynamoErrorMessage));

      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.deleteDocuments, [queriedMatch['documentType-id']]);
      expect.assertions(3);
    });
  });
});
