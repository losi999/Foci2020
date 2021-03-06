import { default as handler } from '@foci2020/api/functions/delete-match/delete-match-handler';

describe('Delete match handler', () => {
  let mockDeleteMatchService: jest.Mock;

  beforeEach(() => {
    mockDeleteMatchService = jest.fn();
  });

  it('should respond with error if deleteMatch throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}',
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockDeleteMatchService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockDeleteMatchService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if deleteMatch executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}',
    } as AWSLambda.APIGatewayProxyEvent;

    mockDeleteMatchService.mockResolvedValue(undefined);

    const response = await handler(mockDeleteMatchService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
