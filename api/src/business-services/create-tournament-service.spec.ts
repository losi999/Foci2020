import { createTournamentServiceFactory, ICreateTournamentService } from '@/business-services/create-tournament-service';
import { IDatabaseService } from '@/services/database-service';
import { TournamentRequest } from '@/types/requests';
describe('Create tournament service', () => {
  let mockDatabaseService: IDatabaseService;
  let mockSaveTournament: jest.Mock;
  let mockUuid: jest.Mock;
  let service: ICreateTournamentService;

  beforeEach(() => {
    mockSaveTournament = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      saveTournament: mockSaveTournament
    })))() as IDatabaseService;

    mockUuid = jest.fn();

    service = createTournamentServiceFactory(mockDatabaseService, mockUuid);
  });

  it('should throw error if unable to save tournament', async () => {
    const body = {} as TournamentRequest;
    mockUuid.mockReturnValue('uuid');
    mockSaveTournament.mockRejectedValue({});
    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while saving tournament');
    }
  });

  it('should return undefined if tournament is saved', async () => {
    const tournamentName = 'tournamentName';
    const body = {
      tournamentName
    } as TournamentRequest;
    mockUuid.mockReturnValue('uuid');
    mockSaveTournament.mockResolvedValue(undefined);
    const result = await service({ body });
    expect(result).toBeUndefined();
    expect(mockSaveTournament).toHaveBeenCalledWith({
      tournamentName,
      tournamentId: 'uuid',
      documentType: 'tournament',
      'documentType-id': 'tournament-uuid',
      orderingValue: tournamentName,
      segment: 'details',
    });
  });
});
