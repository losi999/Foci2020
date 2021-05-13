import { default as handler } from '@foci2020/api/functions/get-default-tournament-id/get-default-tournament-id-handler';
import { IGetDefaultTournamentIdService } from './get-default-tournament-id-service';

describe('List teams handler', () => {
  let mockGetDefaultTournamentId: jest.Mock<ReturnType<IGetDefaultTournamentIdService>, Parameters<IGetDefaultTournamentIdService>>;

  beforeEach(() => {
    mockGetDefaultTournamentId = jest.fn();
  });

  it('should respond with error if getDefaultTournamentId throws error', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const statusCode = 418;
    const message = 'This is an error';
    mockGetDefaultTournamentId.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockGetDefaultTournamentId)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and tournamentId if getDefaultTournamentId executes successfully', async () => {
    const handlerEvent = {
      body: '{}', 
    } as AWSLambda.APIGatewayProxyEvent;

    const tournamentId = 'tournamentId';
    mockGetDefaultTournamentId.mockResolvedValue(tournamentId);

    const response = await handler(mockGetDefaultTournamentId)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).tournamentId).toEqual(tournamentId);
  });
});
