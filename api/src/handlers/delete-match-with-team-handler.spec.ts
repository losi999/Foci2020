import { SNSEvent } from 'aws-lambda';
import { default as handler } from '@/handlers/delete-match-with-team-handler';

describe('Delete match with team handler', () => {
  let mockDeleteMatchWithTeamService: jest.Mock;

  beforeEach(() => {
    mockDeleteMatchWithTeamService = jest.fn();
  });

  it('should call deleteMatchWithTeam with received team document', async () => {
    const teamId = 'teamId';
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: teamId
        }
      }]
    } as SNSEvent;

    mockDeleteMatchWithTeamService.mockResolvedValue(undefined);
    await handler(mockDeleteMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTeamService).toHaveBeenCalledWith({ teamId });
  });

  it('should throw error if deleteMatchWithTeam throws error', async () => {
    const teamId = 'teamId';
    const handlerEvent = {
      Records: [{
        Sns: {
          Message: teamId
        }
      }]
    } as SNSEvent;

    const errorMessage = 'This is an error';
    mockDeleteMatchWithTeamService.mockRejectedValueOnce(errorMessage);

    try {
      await handler(mockDeleteMatchWithTeamService)(handlerEvent, undefined, undefined);
    } catch (error) {
      expect(mockDeleteMatchWithTeamService).toHaveBeenCalledWith({ teamId });
      expect(error).toEqual(errorMessage);
    }
  });
});
