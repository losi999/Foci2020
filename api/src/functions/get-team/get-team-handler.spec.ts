import { default as handler } from '@/functions/get-team/get-team-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { teamResponse } from '@/common/test-data-factory';

describe('Get team handler', () => {
  let mockGetTeamService: jest.Mock;

  beforeEach(() => {
    mockGetTeamService = jest.fn();
  });

  it('should respond with error if getTeam throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockGetTeamService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockGetTeamService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and team if getTeam executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}'
    } as APIGatewayProxyEvent;
    const team = teamResponse();
    mockGetTeamService.mockResolvedValue(team);

    const response = await handler(mockGetTeamService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(team);
  });
});
