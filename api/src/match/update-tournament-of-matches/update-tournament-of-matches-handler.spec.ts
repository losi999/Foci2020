import { default as handler } from '@/match/update-tournament-of-matches/update-tournament-of-matches-handler';
import { SNSEvent } from 'aws-lambda';
import { validateError } from '@/shared/common';

describe('Update tournament of matcheshandler', () => {
  let mockUpdateTournamentOfMatchesService: jest.Mock;
  let snsHandler: ReturnType<typeof handler>;

  beforeEach(() => {
    mockUpdateTournamentOfMatchesService = jest.fn();

    snsHandler = handler(mockUpdateTournamentOfMatchesService);
  });

  const snsMessage = {};

  it('should return with error if updateTournamentOfMatches throws error', async () => {
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(snsMessage)
        }
      }]
    } as SNSEvent;

    mockUpdateTournamentOfMatchesService.mockRejectedValue('This is an error');

    try {
      await snsHandler(handlerEvent, undefined, undefined);
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect(mockUpdateTournamentOfMatchesService).toHaveBeenCalledWith(snsMessage);
    expect.assertions(2);
  });

  it('should return with undefined if updateTournamentOfMatches executes successfully', async () => {
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(snsMessage)
        }
      }]
    } as SNSEvent;

    mockUpdateTournamentOfMatchesService.mockResolvedValue(undefined);

    const response = await snsHandler(handlerEvent, undefined, undefined);

    expect(response).toBeUndefined();
    expect(mockUpdateTournamentOfMatchesService).toHaveBeenCalledWith(snsMessage);
  });
});
