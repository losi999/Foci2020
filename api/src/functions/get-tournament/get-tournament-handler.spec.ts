import { default as handler } from '@foci2020/api/functions/get-tournament/get-tournament-handler';
import { tournamentResponse } from '@foci2020/shared/common/test-data-factory';

describe('Get tournament handler', () => {
  let mockGetTournamentService: jest.Mock;

  beforeEach(() => {
    mockGetTournamentService = jest.fn();
  });

  it('should respond with error if getTournament throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}',
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockGetTournamentService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockGetTournamentService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and tournament if getTournament executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}',
    } as AWSLambda.APIGatewayProxyEvent;
    const tournament = tournamentResponse();
    mockGetTournamentService.mockResolvedValue(tournament);

    const response = await handler(mockGetTournamentService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(tournament);
  });
});
