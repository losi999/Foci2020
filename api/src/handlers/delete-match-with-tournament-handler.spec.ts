import { DynamoDB } from 'aws-sdk';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { default as handler } from '@/handlers/delete-match-with-team-handler';
import { TeamDocument } from '@/types/documents';

describe('Delete match with team handler', () => {
  let unmarshallSpy: jest.SpyInstance;
  let mockDeleteMatchWithTeamService: jest.Mock;

  beforeEach(() => {
    unmarshallSpy = jest.spyOn(DynamoDB.Converter, 'unmarshall');
    mockDeleteMatchWithTeamService = jest.fn();
  });

  afterEach(() => {
    unmarshallSpy.mockReset();
  });

  it('should call deleteMatchWithTeam with received team document', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'REMOVE',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const team = {
      documentType: 'team',
      teamId: 'team1'
    } as TeamDocument;

    unmarshallSpy.mockReturnValue(team);
    mockDeleteMatchWithTeamService.mockResolvedValue(undefined);
    await handler(mockDeleteMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTeamService).toHaveBeenCalledWith({ team });
  });

  it('should not call deleteMatchWithTeam if it is not a REMOVE event', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'INSERT',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    await handler(mockDeleteMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(unmarshallSpy).not.toHaveBeenCalled();
    expect(mockDeleteMatchWithTeamService).not.toHaveBeenCalled();
  });

  it('should not call deleteMatchWithTeam if documentType is not team', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'REMOVE',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const team = {
      documentType: 'match',
      teamId: 'team1'
    };

    unmarshallSpy.mockReturnValue(team);

    await handler(mockDeleteMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTeamService).not.toHaveBeenCalled();
  });

  it('should handle error if deleteMatchWithTeam throws error', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'REMOVE',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const team = {
      documentType: 'team',
      teamId: 'team1'
    } as TeamDocument;

    unmarshallSpy.mockReturnValue(team);
    mockDeleteMatchWithTeamService.mockRejectedValueOnce(undefined);
    await handler(mockDeleteMatchWithTeamService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTeamService).toHaveBeenCalledWith({ team });
  });
});
