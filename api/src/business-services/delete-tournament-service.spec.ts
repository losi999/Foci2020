import { IDatabaseService } from '@/services/database-service';
import { IDeleteTournamentService, deleteTournamentServiceFactory } from '@/business-services/delete-tournament-service';

describe('Delete tournament service', () => {
  let service: IDeleteTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockDeleteTournament: jest.Mock;

  beforeEach(() => {
    mockDeleteTournament = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      deleteTournament: mockDeleteTournament,
    }))) as IDatabaseService;

    service = deleteTournamentServiceFactory(mockDatabaseService);
  });

  it('should return with undefined', async () => {
    const tournamentId = 'tournamentId';

    mockDeleteTournament.mockResolvedValue(undefined);

    const result = await service({ tournamentId });
    expect(result).toBeUndefined();
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';

    mockDeleteTournament.mockRejectedValue('This is a dynamo error');

    try {
      await service({ tournamentId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to delete tournament');
    }
  });
});
