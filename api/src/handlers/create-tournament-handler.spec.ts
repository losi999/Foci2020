import { default as handler } from '@/handlers/create-tournament-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Create tournament handler', () => {
  let mockCreateTournamentService: jest.Mock;

  beforeEach(() => {
    mockCreateTournamentService = jest.fn();
  });

  it('should respond with error if createTournament throws error', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockCreateTournamentService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockCreateTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if createTournament executes successfully', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;
    const tournamentId = 'tournamentId';

    mockCreateTournamentService.mockResolvedValue(tournamentId);

    const response = await handler(mockCreateTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).tournamentId).toEqual(tournamentId);
  });
});
