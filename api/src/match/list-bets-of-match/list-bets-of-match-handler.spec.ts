import { default as handler } from '@/match/list-bets-of-match/list-bets-of-match-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Place bet handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockListBetsOfMatchService: jest.Mock;

  beforeEach(() => {
    mockListBetsOfMatchService = jest.fn();

    apiHandler = handler(mockListBetsOfMatchService);
  });

  const matchId = 'matchId';
  const userId = 'userId';
  const handlerEvent = {
    pathParameters: {
      matchId
    } as any,
    requestContext: {
      authorizer: {
        claims: {
          sub: userId,
        }
      }
    } as any
  } as APIGatewayProxyEvent;

  it('should respond with error if list bets of match throws error', async () => {
    const statusCode = 418;
    const message = 'This is an error';
    mockListBetsOfMatchService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
    expect(mockListBetsOfMatchService).toHaveBeenCalledWith({
      matchId,
      userId,
    });
    expect.assertions(3);
  });

  it('should respond with HTTP 200 if list bets of match executes successfully', async () => {
    mockListBetsOfMatchService.mockResolvedValue(undefined);

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(mockListBetsOfMatchService).toHaveBeenCalledWith({
      matchId,
      userId,
    });
    expect.assertions(2);
  });
});
