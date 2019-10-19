import { DynamoDB } from 'aws-sdk';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { default as handler } from '@/handlers/update-match-with-team-handler';
import { TeamDocument } from '@/types/documents';

describe('Update match with team handler', () => {
  let unmarshallSpy: jest.SpyInstance;
  let mockUpdateMatchWithTeamService: jest.Mock;

  beforeEach(() => {
    unmarshallSpy = jest.spyOn(DynamoDB.Converter, 'unmarshall');
    mockUpdateMatchWithTeamService = jest.fn();
  });

  afterEach(() => {
    unmarshallSpy.mockReset();
  });

  it('should call updateMatchWithTeam with received team document', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const team = {
      documentType: 'team',
      teamId: 'team1'
    } as TeamDocument;

    unmarshallSpy.mockReturnValue(team);
    mockUpdateMatchWithTeamService.mockResolvedValue(undefined);
    await handler(mockUpdateMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTeamService).toHaveBeenCalledWith({ team });
  });

  it('should not call updateMatchWithTeam if it is not a MODIFY event', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'INSERT',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    await handler(mockUpdateMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(unmarshallSpy).not.toHaveBeenCalled();
    expect(mockUpdateMatchWithTeamService).not.toHaveBeenCalled();
  });

  it('should not call updateMatchWithTeam if documentType is not team', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const team = {
      documentType: 'match',
      teamId: 'team1'
    };

    unmarshallSpy.mockReturnValue(team);

    await handler(mockUpdateMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTeamService).not.toHaveBeenCalled();
  });

  it('should handle error if updateMatchWithTeam throws error', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const team = {
      documentType: 'team',
      teamId: 'team1'
    } as TeamDocument;

    unmarshallSpy.mockReturnValue(team);
    mockUpdateMatchWithTeamService.mockRejectedValueOnce(undefined);
    await handler(mockUpdateMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTeamService).toHaveBeenCalledWith({ team });
  });
});
