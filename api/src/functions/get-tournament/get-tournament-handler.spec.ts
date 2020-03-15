import { default as handler } from '@/functions/get-tournament/get-tournament-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TournamentResponse } from '@/types/types';

describe('Get tournament handler', () => {
  let mockGetTournamentService: jest.Mock;

  beforeEach(() => {
    mockGetTournamentService = jest.fn();
  });

  it('should respond with error if getTournament throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockGetTournamentService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockGetTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and tournament if getTournament executes successfully', async () => {
    const tournamentId = 'tournamentId';
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;
    const tournament: TournamentResponse = {
      tournamentId
    } as TournamentResponse;
    mockGetTournamentService.mockResolvedValue(tournament);

    const response = await handler(mockGetTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(tournament);
  });
});
