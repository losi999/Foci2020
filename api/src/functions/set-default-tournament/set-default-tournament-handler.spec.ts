import { default as handler } from '@foci2020/api/functions/set-default-tournament/set-default-tournament-handler';
import { ISetDefaultTournamentService } from '@foci2020/api/functions/set-default-tournament/set-default-tournament-service';
import { validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { TournamentId, TournamentIdType } from '@foci2020/shared/types/common';

describe('Set default tournament handler', () => {
  let mockSetDefaultTournament: jest.Mock<ReturnType<ISetDefaultTournamentService>, Parameters<ISetDefaultTournamentService>>;

  beforeEach(() => {
    mockSetDefaultTournament = jest.fn();
  });

  const tournamentId = 'tournamentId' as TournamentIdType;
  const body: TournamentId = {
    tournamentId,
  };
  const handlerEvent = {
    body: JSON.stringify(body), 
  } as AWSLambda.APIGatewayProxyEvent;

  it('should respond with error if setDefaultTournament throws error', async () => {
    const statusCode = 418;
    const message = 'This is an error';
    mockSetDefaultTournament.mockRejectedValue({
      statusCode,
      message,
    });

    const response = await handler(mockSetDefaultTournament)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;
    
    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
  });

  it('should respond with HTTP 200 and tournamentId if setDefaultTournament executes successfully', async () => {
    mockSetDefaultTournament.mockResolvedValue();

    const response = await handler(mockSetDefaultTournament)(handlerEvent, undefined, undefined) as AWSLambda.APIGatewayProxyResult;
    validateFunctionCall(mockSetDefaultTournament, body);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body).tournamentId).toEqual(tournamentId);
  });
});
