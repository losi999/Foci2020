import { default as handler } from '@foci2020/api/functions/delete-team/delete-team-handler';

describe('Delete team handler', () => {
  let mockDeleteTeamService: jest.Mock;

  beforeEach(() => {
    mockDeleteTeamService = jest.fn();
  });

  it('should respond with error if deleteTeam throws error', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}',
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockDeleteTeamService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockDeleteTeamService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 if deleteTeam executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {},
      body: '{}',
    } as AWSLambda.APIGatewayProxyEvent;

    mockDeleteTeamService.mockResolvedValue(undefined);

    const response = await handler(mockDeleteTeamService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual('');
  });
});
