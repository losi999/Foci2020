import { IUpdateMatchWithTournamentService, updateMatchWithTournamentServiceFactory } from '@/business-services/update-match-with-tournament-service';
import { IDatabaseService } from '@/services/database-service';

describe('Update match with tournament service', () => {
  let service: IUpdateMatchWithTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchesByTournamentId: jest.Mock;
  let mockUpdateMatchWithTournament: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchWithTournament = jest.fn();
    mockQueryMatchesByTournamentId = jest.fn();

    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      updateMatchWithTournament: mockUpdateMatchWithTournament,
      queryMatchKeysByTournamentId: mockQueryMatchesByTournamentId
    })))() as IDatabaseService;

    service = updateMatchWithTournamentServiceFactory(mockDatabaseService);
  });

  it('should return undefined if matches are updated sucessfully', async () => {

  });
});
