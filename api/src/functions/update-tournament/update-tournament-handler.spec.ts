import { default as handler } from '@foci2020/api/functions/update-tournament/update-tournament-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Update tournament handler', () => {
  let mockUpdateTournamentService: jest.Mock;

  beforeEach(() => {
    mockUpdateTournamentService = jest.fn();
  });

  const handlerEvent = {
    body: '{}',
    pathParameters: {},
    headers: {}
  } as APIGatewayProxyEvent;
  it('should respond with error if updateTournament throws error', async () => {

    const statusCode = 418;
    const message = 'This is an error';
    mockUpdateTournamentService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockUpdateTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if updateTournament executes successfully', async () => {
    mockUpdateTournamentService.mockResolvedValue(undefined);

    const response = await handler(mockUpdateTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
