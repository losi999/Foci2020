import { IGetTournamentService, getTournamentServiceFactory } from '@/functions/get-tournament/get-tournament-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { TournamentDocument, TournamentResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('Get tournament service', () => {
  let service: IGetTournamentService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getTournamentById');

    mockTournamentDocumentConverter = createMockService('toResponse');

    service = getTournamentServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with a tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'Tournament';
    const tournamentDocument = {
      tournamentName,
      id: tournamentId,
    } as TournamentDocument;

    mockDatabaseService.functions.getTournamentById.mockResolvedValue(tournamentDocument);

    const tournamentResponse = {
      tournamentId,
      tournamentName
    } as TournamentResponse;

    mockTournamentDocumentConverter.functions.toResponse.mockReturnValueOnce(tournamentResponse);

    const result = await service({ tournamentId });
    expect(result).toEqual(tournamentResponse);
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockTournamentDocumentConverter.functions.toResponse).toHaveBeenCalledWith(tournamentDocument);
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    mockDatabaseService.functions.getTournamentById.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to query tournament', 500));
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockTournamentDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should return with error if no tournament found', async () => {
    const tournamentId = 'tournamentId';
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

    await service({ tournamentId }).catch(validateError('No tournament found', 404));
    expect(mockDatabaseService.functions.getTournamentById).toHaveBeenCalledWith(tournamentId);
    expect(mockTournamentDocumentConverter.functions.toResponse).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
