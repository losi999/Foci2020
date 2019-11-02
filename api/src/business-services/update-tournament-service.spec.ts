import { IUpdateTournamentService, updateTournamentServiceFactory } from '@/business-services/update-tournament-service';
import { TournamentRequest } from '@/types/requests';
import { INotificationService } from '@/services/notification-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';

describe('Update tournament service', () => {
  let service: IUpdateTournamentService;
  let mockTournamentDocumentService: ITournamentDocumentService;
  let mockUpdateTournament: jest.Mock;
  let mockNotificationService: INotificationService;
  let mockTournamentUpdated: jest.Mock;

  beforeEach(() => {
    mockUpdateTournament = jest.fn();
    mockTournamentDocumentService = new (jest.fn<Partial<ITournamentDocumentService>, undefined[]>(() => ({
      updateTournament: mockUpdateTournament
    }))) as ITournamentDocumentService;

    mockTournamentUpdated = jest.fn();
    mockNotificationService = new (jest.fn<Partial<INotificationService>, undefined[]>(() => ({
      tournamentUpdated: mockTournamentUpdated
    })))() as INotificationService;

    service = updateTournamentServiceFactory(mockTournamentDocumentService, mockNotificationService);
  });

  it('should return with with undefined if tournament is updated successfully', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    mockUpdateTournament.mockResolvedValue(undefined);
    mockTournamentUpdated.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockUpdateTournament).toHaveBeenCalledWith(tournamentId, body);
  });

  it('should throw error if unable to update tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    mockUpdateTournament.mockRejectedValue('This is a dynamo error');

    try {
      await service({
        tournamentId,
        body
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Error while updating tournament');
    }
  });

  it('should throw error if unable to send notification', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    mockUpdateTournament.mockResolvedValue(undefined);
    mockTournamentUpdated.mockRejectedValue('This is an SNS error');

    try {
      await service({
        tournamentId,
        body
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to send tournament updated notification');
    }
  });
});
