import { default as handler } from '@foci2020/api/functions/create-team/create-team-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Create team handler', () => {
  let mockCreateTeamService: jest.Mock;

  beforeEach(() => {
    mockCreateTeamService = jest.fn();
  });

  it('should respond with error if createTeam throws error', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockCreateTeamService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockCreateTeamService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if createTeam executes successfully', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;
    const teamId = 'teamId';

    mockCreateTeamService.mockResolvedValue(teamId);

    const response = await handler(mockCreateTeamService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).teamId).toEqual(teamId);
  });
});
