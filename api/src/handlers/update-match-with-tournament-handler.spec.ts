import { default as handler } from '@/handlers/update-match-with-tournament-handler';
import { SNSEvent } from 'aws-lambda';
import { UpdateTournamentNotification } from '@/types/types';
import { TournamentDocument } from '@/types/documents';

describe('Update match with tournament handler', () => {
  let mockUpdateMatchWithTournamentService: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchWithTournamentService = jest.fn();
  });

  it('should call updateMatchWithTournament with received tournament document', async () => {
    const notification: UpdateTournamentNotification = {
      tournamentId: 'tournamentId',
      tournament: {
        tournamentName: 'tournamentName',
      } as TournamentDocument
    };
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(notification)
        }
      }]
    } as SNSEvent;

    mockUpdateMatchWithTournamentService.mockResolvedValue(undefined);
    await handler(mockUpdateMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTournamentService).toHaveBeenCalledWith({ ...notification });
  });

  it('should throw error if updateMatchWithTournament throws error', async () => {
    const notification: UpdateTournamentNotification = {
      tournamentId: 'tournamentId',
      tournament: {
        tournamentName: 'tournamentName',
      } as TournamentDocument
    };
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(notification)
        }
      }]
    } as SNSEvent;

    const errorMessage = 'This is an error';
    mockUpdateMatchWithTournamentService.mockRejectedValueOnce(errorMessage);

    try {
      await handler(mockUpdateMatchWithTournamentService)(handlerEvent, undefined, undefined);
    } catch (error) {
      expect(mockUpdateMatchWithTournamentService).toHaveBeenCalledWith({ ...notification });
      expect(error).toEqual(errorMessage);
    }
  });
});
