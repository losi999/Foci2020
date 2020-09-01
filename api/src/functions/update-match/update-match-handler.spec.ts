import { default as handler } from '@foci2020/api/functions/update-match/update-match-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Update match handler', () => {
  let mockUpdateMatchService: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchService = jest.fn();
  });

  const handlerEvent = {
    body: '{}',
    pathParameters: {},
    headers: {}
  } as APIGatewayProxyEvent;
  it('should respond with error if updateMatch throws error', async () => {

    const statusCode = 418;
    const message = 'This is an error';
    mockUpdateMatchService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockUpdateMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if updateMatch executes successfully', async () => {
    mockUpdateMatchService.mockResolvedValue(undefined);

    const response = await handler(mockUpdateMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
