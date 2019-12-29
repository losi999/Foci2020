import { IGetTournamentService, getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('Get tournament service', () => {
  let service: IGetTournamentService;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockTournamentDocumentService = createMockService('queryTournamentById');

    mockTournamentDocumentConverter = createMockService('toResponse');

    service = getTournamentServiceFactory(mockTournamentDocumentService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with a tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'Tournament';
    const tournamentDocument = {
      tournamentName,
      id: tournamentId,
    } as TournamentDocument;

    mockTournamentDocumentService.functions.queryTournamentById.mockResolvedValue(tournamentDocument);

    const tournamentResponse = {
      tournamentId,
      tournamentName
    } as TournamentResponse;

    mockTournamentDocumentConverter.functions.toResponse.mockReturnValueOnce(tournamentResponse);

    const result = await service({ tournamentId });
    expect(result).toEqual(tournamentResponse);
    expect(mockTournamentDocumentConverter.functions.toResponse).toHaveBeenCalledWith(tournamentDocument);
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    mockTournamentDocumentService.functions.queryTournamentById.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to query tournament', 500));
  });
});
