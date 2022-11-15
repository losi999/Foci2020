import { default as handler } from '@foci2020/api/functions/confirm-forgot-password/confirm-forgot-password-handler';

describe('Confirm forgot password handler', () => {
  let mockConfirmForgotPasswordService: jest.Mock;
  let apiHandler: ReturnType<typeof handler>;

  beforeEach(() => {
    mockConfirmForgotPasswordService = jest.fn();

    apiHandler = handler(mockConfirmForgotPasswordService);
  });

  it('should respond with error if confirm forgot password throws error', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockConfirmForgotPasswordService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if confirm forgot password executes successfully', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;
    
    mockConfirmForgotPasswordService.mockResolvedValue(undefined);

    const response = await apiHandler(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;
    expect(response.statusCode).toEqual(200);
  });
});
