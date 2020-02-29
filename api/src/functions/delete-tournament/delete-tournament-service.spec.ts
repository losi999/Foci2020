import { IDeleteTournamentService, deleteTournamentServiceFactory } from '@/functions/delete-tournament/delete-tournament-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('Delete tournament service', () => {
  let service: IDeleteTournamentService;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;

  beforeEach(() => {
    mockTournamentDocumentService = createMockService('deleteTournament');

    service = deleteTournamentServiceFactory(mockTournamentDocumentService.service);
  });

  it('should return with undefined', async () => {
    const tournamentId = 'tournamentId';

    mockTournamentDocumentService.functions.deleteTournament.mockResolvedValue(undefined);

    const result = await service({ tournamentId });
    expect(result).toBeUndefined();
    expect(mockTournamentDocumentService.functions.deleteTournament).toHaveBeenCalledWith(tournamentId);
    expect.assertions(2);
  });

  it('should throw error if unable to delete tournament', async () => {
    const tournamentId = 'tournamentId';

    mockTournamentDocumentService.functions.deleteTournament.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to delete tournament', 500));
    expect(mockTournamentDocumentService.functions.deleteTournament).toHaveBeenCalledWith(tournamentId);
    expect.assertions(3);
  });
});
