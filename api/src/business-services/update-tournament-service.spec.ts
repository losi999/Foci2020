import { IDatabaseService } from '@/services/database-service';
import { IUpdateTournamentService, updateTournamentServiceFactory } from '@/business-services/update-tournament-service';
import { TournamentRequest } from '@/types/requests';

describe('Update tournament service', () => {
  let service: IUpdateTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockUpdateTournament: jest.Mock;

  beforeEach(() => {
    mockUpdateTournament = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      updateTournament: mockUpdateTournament
    }))) as IDatabaseService;

    service = updateTournamentServiceFactory(mockDatabaseService);
  });

  it('should return with with undefined if tournament is updated successfully', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    mockUpdateTournament.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockUpdateTournament).toHaveBeenCalledWith({
      'documentType-id': `tournament-${tournamentId}`,
      segment: 'details'
    }, body);
  });

  it('should throw error if unable to update tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    mockUpdateTournament.mockRejectedValue('This is a dynamo error');

    try {
      await service({
        tournamentId,
        body
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while updating tournament');
    }
  });
});
