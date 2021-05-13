import { default as handler } from '@foci2020/api/functions/create-tournament/create-tournament-handler';

describe('Create tournament handler', () => {
  let mockCreateTournamentService: jest.Mock;

  beforeEach(() => {
    mockCreateTournamentService = jest.fn();
  });

  const handlerEvent = {
    body: '{}',
    headers: {},
  } as AWSLambda.APIGatewayProxyEvent;
  it('should respond with error if createTournament throws error', async () => {

    const statusCode = 418;
    const message = 'This is an error';
    mockCreateTournamentService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockCreateTournamentService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if createTournament executes successfully', async () => {
    const tournamentId = 'tournamentId';

    mockCreateTournamentService.mockResolvedValue(tournamentId);

    const response = await handler(mockCreateTournamentService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).tournamentId).toEqual(tournamentId);
  });
});
