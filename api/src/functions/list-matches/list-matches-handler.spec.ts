import { default as handler } from '@foci2020/api/functions/list-matches/list-matches-handler';
import { matchResponse } from '@foci2020/shared/common/test-data-factory';

describe('List matches handler', () => {
  let mockListMatchesService: jest.Mock;

  beforeEach(() => {
    mockListMatchesService = jest.fn();
  });

  it('should respond with error if listMatches throws error', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockListMatchesService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockListMatchesService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and list of matches if listMatches executes successfully', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const matches = [matchResponse()];
    mockListMatchesService.mockResolvedValue(matches);

    const response = await handler(mockListMatchesService)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(matches);
  });
});
