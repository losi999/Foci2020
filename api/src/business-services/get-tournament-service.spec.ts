import { IGetTournamentService, getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

describe('Get tournament service', () => {
  let service: IGetTournamentService;
  let mockTournamentDocumentService: ITournamentDocumentService;
  let mockQueryTournamentById: jest.Mock;
  let mockTournamentDocumentConverter: ITournamentDocumentConverter;
  let mockCreateResponse: jest.Mock;

  beforeEach(() => {
    mockQueryTournamentById = jest.fn();
    mockTournamentDocumentService = new (jest.fn<Partial<ITournamentDocumentService>, undefined[]>(() => ({
      queryTournamentById: mockQueryTournamentById,
    }))) as ITournamentDocumentService;

    mockCreateResponse = jest.fn();
    mockTournamentDocumentConverter = new (jest.fn<Partial<ITournamentDocumentConverter>, undefined[]>(() => ({
      createResponse: mockCreateResponse
    })))() as ITournamentDocumentConverter;

    service = getTournamentServiceFactory(mockTournamentDocumentService, mockTournamentDocumentConverter);
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
