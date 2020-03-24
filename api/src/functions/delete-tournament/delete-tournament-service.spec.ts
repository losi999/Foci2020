import { IDeleteTournamentService, deleteTournamentServiceFactory } from '@/functions/delete-tournament/delete-tournament-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IDatabaseService } from '@/services/database-service';

describe('Delete tournament service', () => {
  let service: IDeleteTournamentService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteTournament');

    service = deleteTournamentServiceFactory(mockDatabaseService.service);
  });

  it('should return with undefined', async () => {
    const tournamentId = 'tournamentId';

    mockDatabaseService.functions.deleteTournament.mockResolvedValue(undefined);

    const result = await service({ tournamentId });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.deleteTournament, tournamentId);
    expect.assertions(2);
  });

  it('should throw error if unable to delete tournament', async () => {
    const tournamentId = 'tournamentId';

    mockDatabaseService.functions.deleteTournament.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to delete tournament', 500));
    validateFunctionCall(mockDatabaseService.functions.deleteTournament, tournamentId);
    expect.assertions(3);
  });
});
