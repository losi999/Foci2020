import { default as handler } from '@foci2020/api/functions/list-tournaments/list-tournaments-handler';
import { tournamentResponse } from '@foci2020/shared/common/test-data-factory';

describe('List tournaments handler', () => {
  let mockListTournamentsService: jest.Mock;

  beforeEach(() => {
    mockListTournamentsService = jest.fn();
  });

  it('should respond with error if listTournaments throws error', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockListTournamentsService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockListTournamentsService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and list of tournaments if listTournaments executes successfully', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const tournaments = [tournamentResponse()];
    mockListTournamentsService.mockResolvedValue(tournaments);

    const response = await handler(mockListTournamentsService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(tournaments);
  });
});
