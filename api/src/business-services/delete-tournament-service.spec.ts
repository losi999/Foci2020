import { IDeleteTournamentService, deleteTournamentServiceFactory } from '@/business-services/delete-tournament-service';
import { INotificationService } from '@/services/notification-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('Delete tournament service', () => {
  let service: IDeleteTournamentService;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockNotificationService: Mock<INotificationService>;

  beforeEach(() => {
    mockTournamentDocumentService = createMockService('deleteTournament');
    mockNotificationService = createMockService('tournamentDeleted');

    service = deleteTournamentServiceFactory(mockTournamentDocumentService.service, mockNotificationService.service);
  });

  it('should return with undefined', async () => {
    const tournamentId = 'tournamentId';

    mockTournamentDocumentService.functions.deleteTournament.mockResolvedValue(undefined);
    mockNotificationService.functions.tournamentDeleted.mockResolvedValue(undefined);

    const result = await service({ tournamentId });
    expect(result).toBeUndefined();
    expect(mockTournamentDocumentService.functions.deleteTournament).toHaveBeenCalledWith(tournamentId);
    expect(mockNotificationService.functions.tournamentDeleted).toHaveBeenCalledWith(tournamentId);
  });

  it('should throw error if unable to delete tournament', async () => {
    const tournamentId = 'tournamentId';

    mockTournamentDocumentService.functions.deleteTournament.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to delete tournament', 500));
    expect(mockTournamentDocumentService.functions.deleteTournament).toHaveBeenCalledWith(tournamentId);
    expect(mockNotificationService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if unable to send notification', async () => {
    const tournamentId = 'tournamentId';

    mockTournamentDocumentService.functions.deleteTournament.mockResolvedValue(undefined);
    mockNotificationService.functions.tournamentDeleted.mockRejectedValue('This is an SNS error');

    await service({ tournamentId }).catch(validateError('Unable to send tournament deleted notification', 500));
    expect(mockTournamentDocumentService.functions.deleteTournament).toHaveBeenCalledWith(tournamentId);
    expect(mockNotificationService.functions.tournamentDeleted).toHaveBeenCalledWith(tournamentId);
    expect.assertions(4);
  });
});
