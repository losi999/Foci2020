import { default as handler } from '@/handlers/api-request-validator-handler';
import { IValidatorService } from '@/services/validator-service';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('API request validator handler', () => {
  let mockValidatorService: IValidatorService;
  let mockValidate: jest.Mock;
  let mockInnerHandler: jest.Mock;
  beforeEach(() => {
    mockValidate = jest.fn();
    mockValidatorService = new (jest.fn<IValidatorService, undefined[]>(() => ({
      validate: mockValidate
    })))();

    mockInnerHandler = jest.fn();
  });

  it('should respond with HTTP 400 if request is not valid', async () => {
    const handlerEvent = {

    } as APIGatewayProxyEvent;
    mockValidate.mockReturnValue({});
    const response = await handler(mockValidatorService)({
      body: {}
    })(mockInnerHandler)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;
    expect(response.statusCode).toEqual(400);
    expect(mockInnerHandler).not.toHaveBeenCalled();
  });

  it('should call inner handler if request is valid', async () => {
    const handlerEvent = {

    } as APIGatewayProxyEvent;

    mockValidate.mockReturnValue(undefined);
    const statusCode = 418;
    const body = 'I\'m a teapot';
    mockInnerHandler.mockResolvedValue({
      statusCode,
      body
    });
    const response = await handler(mockValidatorService)({
      body: {}
    })(mockInnerHandler)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(body);
  });
});
