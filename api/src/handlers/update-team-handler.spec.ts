import { default as handler } from '@/handlers/update-team-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Update team handler', () => {
  let mockUpdateTeamService: jest.Mock;

  beforeEach(() => {
    mockUpdateTeamService = jest.fn();
  });

  it('should respond with error if updateTeam throws error', async () => {
    const handlerEvent = {
      body: '{}',
      pathParameters: {}
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockUpdateTeamService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockUpdateTeamService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if updateTeam executes successfully', async () => {
    const handlerEvent = {
      body: '{}',
      pathParameters: {}
    } as APIGatewayProxyEvent;

    mockUpdateTeamService.mockResolvedValue(undefined);

    const response = await handler(mockUpdateTeamService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
  });
});
