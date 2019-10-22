import { IDatabaseService } from '@/services/database-service';
import { IGetTournamentService, getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';

describe('Get tournament service', () => {
  let service: IGetTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryTournamentById: jest.Mock;
  let mockConverter: jest.Mock;

  beforeEach(() => {
    mockQueryTournamentById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryTournamentById: mockQueryTournamentById,
    }))) as IDatabaseService;

    mockConverter = jest.fn();

    service = getTournamentServiceFactory(mockDatabaseService, mockConverter);
  });

  it('should return with a tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'Tournament';
    const tournamentDocument = {
      tournamentId,
      tournamentName,
      segment: 'details',
    } as TournamentDocument;

    mockQueryTournamentById.mockResolvedValue(tournamentDocument);

    const tournamentResponse = {
      tournamentId,
      tournamentName
    } as TournamentResponse;

    mockConverter.mockReturnValueOnce(tournamentResponse);

    const result = await service({ tournamentId });
    expect(result).toEqual(tournamentResponse);
    expect(mockConverter).toHaveBeenCalledWith(tournamentDocument);
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    mockQueryTournamentById.mockRejectedValue('This is a dynamo error');

    try {
      await service({ tournamentId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query tournament');
    }
  });
});
