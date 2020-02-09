import { default as handler } from '@/match/update-team-of-matches/update-team-of-matches-handler';
import { SNSEvent } from 'aws-lambda';
import { validateError } from '@/shared/common';

describe('Update team of matches handler', () => {
  let mockUpdateTeamOfMatchesService: jest.Mock;
  let snsHandler: ReturnType<typeof handler>;

  beforeEach(() => {
    mockUpdateTeamOfMatchesService = jest.fn();

    snsHandler = handler(mockUpdateTeamOfMatchesService);
  });

  const snsMessage = {};

  it('should return with error if updateTeamOfMatches throws error', async () => {
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(snsMessage)
        }
      }]
    } as SNSEvent;

    mockUpdateTeamOfMatchesService.mockRejectedValue('This is an error');

    try {
      await snsHandler(handlerEvent, undefined, undefined);
    } catch (error) {
      expect(error).toBeDefined();
    }
    expect(mockUpdateTeamOfMatchesService).toHaveBeenCalledWith(snsMessage);
    expect.assertions(2);
  });

  it('should return with undefined if updateTeamOfMatches executes successfully', async () => {
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(snsMessage)
        }
      }]
    } as SNSEvent;

    mockUpdateTeamOfMatchesService.mockResolvedValue(undefined);

    const response = await snsHandler(handlerEvent, undefined, undefined);

    expect(response).toBeUndefined();
    expect(mockUpdateTeamOfMatchesService).toHaveBeenCalledWith(snsMessage);
  });
});
