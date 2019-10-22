import { DynamoDB } from 'aws-sdk';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { default as handler } from '@/handlers/delete-match-with-tournament-handler';
import { TournamentDocument } from '@/types/documents';

describe('Delete match with tournament handler', () => {
  let unmarshallSpy: jest.SpyInstance;
  let mockDeleteMatchWithTournamentService: jest.Mock;

  beforeEach(() => {
    unmarshallSpy = jest.spyOn(DynamoDB.Converter, 'unmarshall');
    mockDeleteMatchWithTournamentService = jest.fn();
  });

  afterEach(() => {
    unmarshallSpy.mockReset();
  });

  it('should call deleteMatchWithTournament with received tournament document', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'REMOVE',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const tournament = {
      documentType: 'tournament',
      tournamentId: 'tournament1'
    } as TournamentDocument;

    unmarshallSpy.mockReturnValue(tournament);
    mockDeleteMatchWithTournamentService.mockResolvedValue(undefined);
    await handler(mockDeleteMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTournamentService).toHaveBeenCalledWith({ tournament });
  });

  it('should not call deleteMatchWithTournament if it is not a REMOVE event', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'INSERT',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    await handler(mockDeleteMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(unmarshallSpy).not.toHaveBeenCalled();
    expect(mockDeleteMatchWithTournamentService).not.toHaveBeenCalled();
  });

  it('should not call deleteMatchWithTournament if documentType is not tournament', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'REMOVE',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const tournament = {
      documentType: 'match',
      tournamentId: 'tournament1'
    };

    unmarshallSpy.mockReturnValue(tournament);

    await handler(mockDeleteMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTournamentService).not.toHaveBeenCalled();
  });

  it('should handle error if deleteMatchWithTournament throws error', async () => {
    const handlerEvent = {
      Records: [{
        eventName: 'REMOVE',
        dynamodb: {
          OldImage: {}
        }
      }]
    } as DynamoDBStreamEvent;

    const tournament = {
      documentType: 'tournament',
      tournamentId: 'tournament1'
    } as TournamentDocument;

    unmarshallSpy.mockReturnValue(tournament);
    mockDeleteMatchWithTournamentService.mockRejectedValueOnce(undefined);
    await handler(mockDeleteMatchWithTournamentService)(handlerEvent, undefined, undefined);
    expect(mockDeleteMatchWithTournamentService).toHaveBeenCalledWith({ tournament });
  });
});
