import { default as handler } from '@foci2020/api/functions/create-match/create-match-handler';

describe('Create match handler', () => {
  let mockCreateMatchService: jest.Mock;

  beforeEach(() => {
    mockCreateMatchService = jest.fn();
  });

  const handlerEvent = {
    body: '{}',
    headers: {},
  } as AWSLambda.APIGatewayProxyEvent;
  it('should respond with error if createMatch throws error', async () => {

    const statusCode = 418;
    const message = 'This is an error';
    mockCreateMatchService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockCreateMatchService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if createMatch executes successfully', async () => {
    const matchId = 'matchId';

    mockCreateMatchService.mockResolvedValue(matchId);

    const response = await handler(mockCreateMatchService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).matchId).toEqual(matchId);
  });
});
