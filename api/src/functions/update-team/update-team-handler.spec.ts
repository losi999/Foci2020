import { default as handler } from '@foci2020/api/functions/update-team/update-team-handler';

describe('Update team handler', () => {
  let mockUpdateTeamService: jest.Mock;

  beforeEach(() => {
    mockUpdateTeamService = jest.fn();
  });

  const handlerEvent = {
    body: '{}',
    pathParameters: {},
    headers: {},
  } as AWSLambda.APIGatewayProxyEvent;
  it('should respond with error if updateTeam throws error', async () => {

    const statusCode = 418;
    const message = 'This is an error';
    mockUpdateTeamService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockUpdateTeamService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if updateTeam executes successfully', async () => {
    mockUpdateTeamService.mockResolvedValue(undefined);

    const response = await handler(mockUpdateTeamService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
