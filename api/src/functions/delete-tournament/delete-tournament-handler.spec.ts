import { default as handler } from '@foci2020/api/functions/delete-tournament/delete-tournament-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Delete tournament handler', () => {
  let mockDeleteTournamentService: jest.Mock;

  beforeEach(() => {
    mockDeleteTournamentService = jest.fn();
  });

  it('should respond with error if deleteTournament throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockDeleteTournamentService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockDeleteTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if deleteTournament executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;

    mockDeleteTournamentService.mockResolvedValue(undefined);

    const response = await handler(mockDeleteTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
