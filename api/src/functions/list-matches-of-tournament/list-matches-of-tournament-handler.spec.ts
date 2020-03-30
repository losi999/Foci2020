import { default as handler } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { matchResponse } from '@/common/test-data-factory';

describe('List matches of tournament handler', () => {
  let mockListMatchesOfTournamentService: jest.Mock;

  beforeEach(() => {
    mockListMatchesOfTournamentService = jest.fn();
  });

  const tournamentId = 'tournamentId';

  it('should respond with error if listMatchesOfTournament throws error', async () => {
    const handlerEvent = {
      pathParameters: {
        tournamentId
      } as APIGatewayProxyEvent['pathParameters'],
      body: '{}'
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockListMatchesOfTournamentService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await handler(mockListMatchesOfTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and list of matches if listMatches executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {
        tournamentId
      } as APIGatewayProxyEvent['pathParameters'],
      body: '{}'
    } as APIGatewayProxyEvent;

    const matches = [matchResponse()];
    mockListMatchesOfTournamentService.mockResolvedValue(matches);

    const response = await handler(mockListMatchesOfTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(matches);
  });
});
