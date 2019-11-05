import { createTournamentServiceFactory, ICreateTournamentService } from '@/business-services/create-tournament-service';
import { TournamentRequest } from '@/types/requests';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
describe('Create tournament service', () => {
  let mockTournamentDocumentService: ITournamentDocumentService;
  let mockSaveTournament: jest.Mock;
  let mockUuid: jest.Mock;
  let service: ICreateTournamentService;

  const tournamentId = 'uuid';

  beforeEach(() => {
    mockSaveTournament = jest.fn();
    mockTournamentDocumentService = new (jest.fn<Partial<ITournamentDocumentService>, undefined[]>(() => ({
      saveTournament: mockSaveTournament
    })))() as ITournamentDocumentService;

    mockUuid = jest.fn();

    service = createTournamentServiceFactory(mockTournamentDocumentService, mockUuid);
  });

  it('should throw error if unable to save tournament', async () => {
    const body = {} as TournamentRequest;
    mockUuid.mockReturnValue(tournamentId);
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
    mockUuid.mockReturnValue(tournamentId);
    mockSaveTournament.mockResolvedValue(undefined);
    const result = await service({ body });
    expect(result).toBeUndefined();
    expect(mockSaveTournament).toHaveBeenCalledWith(tournamentId, body);
  });
});
