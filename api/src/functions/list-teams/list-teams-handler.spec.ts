import { default as handler } from '@foci2020/api/functions/list-teams/list-teams-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { teamResponse } from '@foci2020/shared/common/test-data-factory';

describe('List teams handler', () => {
  let mockListTeamsService: jest.Mock;

  beforeEach(() => {
    mockListTeamsService = jest.fn();
  });

  it('should respond with error if listTeams throws error', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockListTeamsService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockListTeamsService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and list of teams if listTeams executes successfully', async () => {
    const handlerEvent = {
      body: '{}'
    } as APIGatewayProxyEvent;

    const teams = [teamResponse()];
    mockListTeamsService.mockResolvedValue(teams);

    const response = await handler(mockListTeamsService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(teams);
  });
});
