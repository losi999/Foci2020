import { default as handler } from '@/match/get-match/get-match-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MatchResponse } from '@/shared/types/types';

describe('Get match handler', () => {
  let mockGetMatchService: jest.Mock;

  beforeEach(() => {
    mockGetMatchService = jest.fn();
  });

  it('should respond with error if getMatch throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockGetMatchService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockGetMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and match if getMatch executes successfully', async () => {
    const matchId = 'matchId';
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;
    const match: MatchResponse = {
      matchId
    } as MatchResponse;
    mockGetMatchService.mockResolvedValue(match);

    const response = await handler(mockGetMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(match);
  });
});
