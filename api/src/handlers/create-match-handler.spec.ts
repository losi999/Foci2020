import { default as handler } from '@/handlers/create-match-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Create match handler', () => {
  let mockCreateMatchService: jest.Mock;

  beforeEach(() => {
    mockCreateMatchService = jest.fn();
  });

  it('should respond with error if createMatch throws error', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockCreateMatchService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockCreateMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 is createMatch executes successfully', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    mockCreateMatchService.mockResolvedValue(undefined);

    const response = await handler(mockCreateMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
  });
});
