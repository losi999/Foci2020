import { IDatabaseService } from '@/services/database-service';
import { IGetTournamentService, getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

describe('Get tournament service', () => {
  let service: IGetTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryTournamentById: jest.Mock;
  let mockTournamentDocumentConverter: ITournamentDocumentConverter;
  let mockCreateResponse: jest.Mock;

  beforeEach(() => {
    mockQueryTournamentById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryTournamentById: mockQueryTournamentById,
    }))) as IDatabaseService;

    mockCreateResponse = jest.fn();
    mockTournamentDocumentConverter = new (jest.fn<Partial<ITournamentDocumentConverter>, undefined[]>(() => ({
      createResponse: mockCreateResponse
    })))() as ITournamentDocumentConverter;

    service = getTournamentServiceFactory(mockDatabaseService, mockTournamentDocumentConverter);
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

    mockCreateResponse.mockReturnValueOnce(tournamentResponse);

    const result = await service({ tournamentId });
    expect(result).toEqual(tournamentResponse);
    expect(mockCreateResponse).toHaveBeenCalledWith(tournamentDocument);
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
