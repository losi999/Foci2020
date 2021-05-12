import { default as handler } from '@foci2020/api/functions/compare-with-player/compare-with-player-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Compare with player handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockCompareWithPlayer: jest.Mock;

  beforeEach(() => {
    mockCompareWithPlayer = jest.fn();

    apiHandler = handler(mockCompareWithPlayer);
  });

  const otherUserId = 'otherUserId';
  const tournamentId = 'tournamentId';
  const ownUserName = 'ownUserName';
  const ownUserId = 'ownUserId';
  const bet = {};
  const handlerEvent = {
    body: JSON.stringify(bet),
    pathParameters: {
      tournamentId,
      userId: otherUserId,
    } as any,
    requestContext: {
      authorizer: {
        claims: {
          sub: ownUserId,
          nickname: ownUserName,
        },
      },
    } as any,
  } as APIGatewayProxyEvent;

  it('should respond with error if compareWithPlayer throws error', async () => {
    const statusCode = 418;
    const message = 'This is an error';
    mockCompareWithPlayer.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
    expect(mockCompareWithPlayer).toHaveBeenCalledWith({
      tournamentId,
      ownUserId,
      otherUserId,
      ownUserName,
    });
    expect.assertions(3);
  });

  it('should respond with HTTP 200 if compareWithPlayer executes successfully', async () => {
    mockCompareWithPlayer.mockResolvedValue(undefined);

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(mockCompareWithPlayer).toHaveBeenCalledWith({
      tournamentId,
      ownUserId,
      otherUserId,
      ownUserName,
    });
    expect.assertions(2);
  });
});
