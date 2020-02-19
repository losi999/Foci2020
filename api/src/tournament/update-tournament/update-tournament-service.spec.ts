import { IUpdateTournamentService, updateTournamentServiceFactory } from '@/tournament/update-tournament/update-tournament-service';
import { INotificationService } from '@/shared/services/notification-service';
import { ITournamentDocumentService } from '@/tournament/tournament-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { ITournamentDocumentConverter } from '@/tournament/tournament-document-converter';
import { TournamentRequest, TournamentDocument } from '@/shared/types/types';

describe('Update tournament service', () => {
  let service: IUpdateTournamentService;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;
  let mockNotificationService: Mock<INotificationService>;

  beforeEach(() => {
    mockTournamentDocumentConverter = createMockService('update');
    mockTournamentDocumentService = createMockService('updateTournament');
    mockNotificationService = createMockService('tournamentUpdated');

    service = updateTournamentServiceFactory(mockTournamentDocumentService.service, mockTournamentDocumentConverter.service, mockNotificationService.service);
  });

  it('should return with with undefined if tournament is updated successfully', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockResolvedValue(undefined);
    mockNotificationService.functions.tournamentUpdated.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body
    });
    expect(result).toBeUndefined();

    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(tournamentId, body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(converted);
    expect(mockNotificationService.functions.tournamentUpdated).toHaveBeenCalledWith({
      tournamentId,
      tournament: converted
    });
  });

  it('should throw error if unable to update tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockRejectedValue('This is a dynamo error');

    await service({
      tournamentId,
      body
    }).catch(validateError('Error while updating tournament', 500));

    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(tournamentId, body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(converted);
    expect(mockNotificationService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect.assertions(5);
  });

  it('should throw error if unable to send notification', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockResolvedValue(undefined);
    mockNotificationService.functions.tournamentUpdated.mockRejectedValue('This is an SNS error');

    await service({
      tournamentId,
      body
    }).catch(validateError('Unable to send tournament updated notification', 500));
    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(tournamentId, body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(converted);
    expect(mockNotificationService.functions.tournamentUpdated).toHaveBeenCalledWith({
      tournamentId,
      tournament: converted
    });
    expect.assertions(5);
  });
});
