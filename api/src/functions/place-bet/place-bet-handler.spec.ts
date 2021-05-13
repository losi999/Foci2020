import { default as handler } from '@foci2020/api/functions/place-bet/place-bet-handler';

describe('Place bet handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockPlaceBetService: jest.Mock;

  beforeEach(() => {
    mockPlaceBetService = jest.fn();

    apiHandler = handler(mockPlaceBetService);
  });

  const matchId = 'matchId';
  const userId = 'userId';
  const userName = 'userName';
  const bet = {};
  const handlerEvent = {
    body: JSON.stringify(bet),
    pathParameters: {
      matchId, 
    } as any,
    requestContext: {
      authorizer: {
        claims: {
          sub: userId,
          nickname: userName,
        },
      },
    } as any,
    headers: {},
  } as AWSLambda.APIGatewayProxyEvent;

  it('should respond with error if placeBet throws error', async () => {
    const statusCode = 418;
    const message = 'This is an error';
    mockPlaceBetService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
    expect(mockPlaceBetService).toHaveBeenCalledWith({
      matchId,
      userId,
      bet,
      userName,
      expiresIn: NaN,
    });
    expect.assertions(3);
  });

  it('should respond with HTTP 200 if placeBet executes successfully', async () => {
    mockPlaceBetService.mockResolvedValue(undefined);

    const response = await apiHandler(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(mockPlaceBetService).toHaveBeenCalledWith({
      matchId,
      userId,
      bet,
      userName,
      expiresIn: NaN,
    });
    expect.assertions(2);
  });
});
