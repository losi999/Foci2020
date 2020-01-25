import { IUpdateTournamentService, updateTournamentServiceFactory } from '@/business-services/update-tournament-service';
import { TournamentRequest } from '@/types/requests';
import { INotificationService } from '@/services/notification-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentDocumentUpdatable, TournamentDocument } from '@/types/documents';

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
    } as TournamentDocumentUpdatable;

    const updated = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockResolvedValue(updated);
    mockNotificationService.functions.tournamentUpdated.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body
    });
    expect(result).toBeUndefined();

    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(tournamentId, converted);
    expect(mockNotificationService.functions.tournamentUpdated).toHaveBeenCalledWith({
      tournamentId,
      tournament: updated
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
    } as TournamentDocumentUpdatable;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockRejectedValue('This is a dynamo error');

    await service({
      tournamentId,
      body
    }).catch(validateError('Error while updating tournament', 500));

    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(tournamentId, converted);
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
    } as TournamentDocumentUpdatable;

    const updated = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockResolvedValue(updated);
    mockNotificationService.functions.tournamentUpdated.mockRejectedValue('This is an SNS error');

    await service({
      tournamentId,
      body
    }).catch(validateError('Unable to send tournament updated notification', 500));
    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(tournamentId, converted);
    expect(mockNotificationService.functions.tournamentUpdated).toHaveBeenCalledWith({
      tournamentId,
      tournament: updated
    });
    expect.assertions(5);
  });
});
