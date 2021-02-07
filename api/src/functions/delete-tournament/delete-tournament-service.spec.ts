import { IDeleteTournamentService, deleteTournamentServiceFactory } from '@foci2020/api/functions/delete-tournament/delete-tournament-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentIdType } from '@foci2020/shared/types/common';

describe('Delete tournament service', () => {
  let service: IDeleteTournamentService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteTournament');

    service = deleteTournamentServiceFactory(mockDatabaseService.service);
  });

  const tournamentId = 'tournamentId' as TournamentIdType;

  it('should return with undefined', async () => {

    mockDatabaseService.functions.deleteTournament.mockResolvedValue(undefined);

    const result = await service({
      tournamentId, 
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockDatabaseService.functions.deleteTournament, tournamentId);
    expect.assertions(2);
  });

  it('should throw error if unable to delete tournament', async () => {
    mockDatabaseService.functions.deleteTournament.mockRejectedValue('This is a dynamo error');

    await service({
      tournamentId, 
    }).catch(validateError('Unable to delete tournament', 500));
    validateFunctionCall(mockDatabaseService.functions.deleteTournament, tournamentId);
    expect.assertions(3);
  });
});
