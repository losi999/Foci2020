import { default as handler } from '@/handlers/delete-matches-by-tournament-handler';
import { SNSEvent } from 'aws-lambda';

describe('Delete match with tournament handler', () => {
  let mockDeleteMatchWithTournamentService: jest.Mock;

  beforeEach(() => {
    mockDeleteMatchWithTournamentService = jest.fn();
  });

  it('should call deleteMatchWithTournament with received tournament document', async () => {
    const tournamentId = 'tournamentId';
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: tournamentId
        }
      }]
    } as SNSEvent;

    mockDeleteMatchWithTournamentService.mockResolvedValue(undefined);
    await handler(mockDeleteMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTournamentService).toHaveBeenCalledWith({ tournamentId });
  });

  it('should throw error if deleteMatchWithTournament throws error', async () => {
    const tournamentId = 'tournamentId';
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: tournamentId
        }
      }]
    } as SNSEvent;

    const errorMessage = 'This is an error';
    mockDeleteMatchWithTournamentService.mockRejectedValueOnce(errorMessage);

    try {
      await handler(mockDeleteMatchWithTournamentService)(handlerEvent, undefined, undefined);
    } catch (error) {
      expect(error).toEqual(errorMessage);
    }
    expect(mockDeleteMatchWithTournamentService).toHaveBeenCalledWith({ tournamentId });
    expect.assertions(2);
  });
});
