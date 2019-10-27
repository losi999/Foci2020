import { SNSEvent } from 'aws-lambda';
import { default as handler } from '@/handlers/update-match-with-team-handler';
import { UpdateTeamNotification } from '@/types/types';

describe('Update match with team handler', () => {
  let mockUpdateMatchWithTeamService: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchWithTeamService = jest.fn();
  });

  it('should call updateMatchWithTeam with received team document', async () => {
    const notification: UpdateTeamNotification = {
      teamId: 'teamId',
      team: {
        image: 'image',
        teamName: 'teamName',
        shortName: 'shortName'
      }
    };
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(notification)
        }
      }]
    } as SNSEvent;

    mockUpdateMatchWithTeamService.mockResolvedValue(undefined);

    await handler(mockUpdateMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTeamService).toHaveBeenCalledWith({ ...notification });
  });

  it('should throw error if updateMatchWithTeam throws error', async () => {
    const notification: UpdateTeamNotification = {
      teamId: 'teamId',
      team: {
        image: 'image',
        teamName: 'teamName',
        shortName: 'shortName'
      }
    };
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: JSON.stringify(notification)
        }
      }]
    } as SNSEvent;

    const errorMessage = 'This is an error';
    mockUpdateMatchWithTeamService.mockRejectedValueOnce(errorMessage);

    try {
      await handler(mockUpdateMatchWithTeamService)(handlerEvent, undefined, undefined);
    } catch (error) {
      expect(mockUpdateMatchWithTeamService).toHaveBeenCalledWith({ ...notification });
      expect(error).toEqual(errorMessage);
    }
  });
});
