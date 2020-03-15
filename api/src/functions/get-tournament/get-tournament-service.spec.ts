import { IGetTournamentService, getTournamentServiceFactory } from '@/functions/get-tournament/get-tournament-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';
import { TournamentDocument, TournamentResponse } from '@/types/types';

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
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockTournamentDocumentConverter.functions.toResponse).toHaveBeenCalledWith(tournamentDocument);
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    mockTournamentDocumentService.functions.queryTournamentById.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to query tournament', 500));
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockTournamentDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no tournament found', async () => {
    const tournamentId = 'tournamentId';
    mockTournamentDocumentService.functions.queryTournamentById.mockResolvedValue(undefined);

    await service({ tournamentId }).catch(validateError('No tournament found', 404));
    expect(mockTournamentDocumentService.functions.queryTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockTournamentDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
