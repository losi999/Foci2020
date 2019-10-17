import { DynamoDB } from 'aws-sdk';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { default as handler } from '@/handlers/update-match-with-tournament-handler';
import { TournamentDocument } from '@/types/documents';

describe('Update match with tournament handler', () => {
  let unmarshallSpy: jest.SpyInstance;
  let mockUpdateMatchWithTournamentService: jest.Mock;

  beforeEach(() => {
    unmarshallSpy = jest.spyOn(DynamoDB.Converter, 'unmarshall');
    mockUpdateMatchWithTournamentService = jest.fn();
  });

  afterEach(() => {
    unmarshallSpy.mockReset();
  });

  it('should call updateMatchWithTournament with received tournament document', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const tournament = {
      documentType: 'tournament',
      tournamentId: 'tournament1'
    } as TournamentDocument;

    unmarshallSpy.mockReturnValue(tournament);
    mockUpdateMatchWithTournamentService.mockResolvedValue(undefined);
    await handler(mockUpdateMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTournamentService).toHaveBeenCalledWith({ tournament });
  });

  it('should not call updateMatchWithTournament if it is not a MODIFY event', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'INSERT',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    await handler(mockUpdateMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(unmarshallSpy).not.toHaveBeenCalled();
    expect(mockUpdateMatchWithTournamentService).not.toHaveBeenCalled();
  });

  it('should not call updateMatchWithTournament if documentType is not tournament', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const tournament = {
      documentType: 'match',
      tournamentId: 'tournament1'
    };

    unmarshallSpy.mockReturnValue(tournament);

    await handler(mockUpdateMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTournamentService).not.toHaveBeenCalled();
  });

  it('should handle error if updateMatchWithTournament throws error', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const tournament = {
      documentType: 'tournament',
      tournamentId: 'tournament1'
    } as TournamentDocument;

    unmarshallSpy.mockReturnValue(tournament);
    mockUpdateMatchWithTournamentService.mockRejectedValueOnce(undefined);
    await handler(mockUpdateMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockUpdateMatchWithTournamentService).toHaveBeenCalledWith({ tournament });
  });
});
