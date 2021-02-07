import { default as handler } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { standingResponse } from '@foci2020/shared/common/test-data-factory';

describe('List standings of tournament handler', () => {
  let mockListStandingsOfTournamentService: jest.Mock;

  beforeEach(() => {
    mockListStandingsOfTournamentService = jest.fn();
  });

  const tournamentId = 'tournamentId';

  it('should respond with error if listStandingsOfTournament throws error', async () => {
    const handlerEvent = {
      pathParameters: {
        tournamentId, 
      } as APIGatewayProxyEvent['pathParameters'],
      body: '{}',
    } as APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockListStandingsOfTournamentService.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockListStandingsOfTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and list of standings if listStandings executes successfully', async () => {
    const handlerEvent = {
      pathParameters: {
        tournamentId, 
      } as APIGatewayProxyEvent['pathParameters'],
      body: '{}',
    } as APIGatewayProxyEvent;

    const standings = [standingResponse()];
    mockListStandingsOfTournamentService.mockResolvedValue(standings);

    const response = await handler(mockListStandingsOfTournamentService)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(standings);
  });
});
