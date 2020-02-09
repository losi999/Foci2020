import { default as handler } from '@/user/registration/registration-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Login handler', () => {
  let mockRegistrationService: jest.Mock;
  let apiHandler: ReturnType<typeof handler>;

  beforeEach(() => {
    mockRegistrationService = jest.fn();

    apiHandler = handler(mockRegistrationService);
  });

  it('should respond with error if registration throws error', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockRegistrationService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and tokens if registration executes successfully', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    mockRegistrationService.mockResolvedValue(undefined);

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
