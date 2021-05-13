import { default as handler } from '@foci2020/api/functions/create-team/create-team-handler';

describe('Create team handler', () => {
  let mockCreateTeamService: jest.Mock;

  beforeEach(() => {
    mockCreateTeamService = jest.fn();
  });

  const handlerEvent = {
    body: '{}',
    headers: {},
  } as AWSLambda.APIGatewayProxyEvent;
  it('should respond with error if createTeam throws error', async () => {

    const statusCode = 418;
    const message = 'This is an error';
    mockCreateTeamService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockCreateTeamService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if createTeam executes successfully', async () => {
    const teamId = 'teamId';

    mockCreateTeamService.mockResolvedValue(teamId);

    const response = await handler(mockCreateTeamService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).teamId).toEqual(teamId);
  });
});
