import { default as handler } from '@/handlers/login-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LoginResponse } from '@/types/responses';

describe('Login handler', () => {
  let mockLoginService: jest.Mock;
  let apiHandler: ReturnType<typeof handler>;

  beforeEach(() => {
    mockLoginService = jest.fn();

    apiHandler = handler(mockLoginService);
  });

  it('should respond with error if login throws error', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockLoginService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and tokens if login executes successfully', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;
    const tokens: LoginResponse = {
      idToken: 'some.id.token',
      refreshToken: 'some.refresh.token'
    };
    mockLoginService.mockResolvedValue(tokens);

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(tokens);
  });
});
