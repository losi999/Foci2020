import { default as handler } from '@foci2020/api/functions/get-match/get-match-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { matchResponse } from '@foci2020/shared/common/test-data-factory';

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
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;
    const match = matchResponse();
    mockGetMatchService.mockResolvedValue(match);

    const response = await handler(mockGetMatchService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(match);
  });
});
