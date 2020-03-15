import { default as handler } from '@/functions/set-final-score-of-match/set-final-score-of-match-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Score } from '@/types/types';

describe('Set final score of match handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockSetFinalScoreOfMatchService: jest.Mock;

  beforeEach(() => {
    mockSetFinalScoreOfMatchService = jest.fn();

    apiHandler = handler(mockSetFinalScoreOfMatchService);
  });

  const matchId = 'matchId';
  const finalScore: Score = {
    homeScore: 1,
    awayScore: 3,
  };
  const handlerEvent = {
    body: JSON.stringify(finalScore),
    pathParameters: {
      matchId
    } as APIGatewayProxyEvent['pathParameters'],
  } as APIGatewayProxyEvent;

  it('should respond with error if setFinalScoreOfMatch throws error', async () => {
    const statusCode = 418;
    const message = 'This is an error';
    mockSetFinalScoreOfMatchService.mockRejectedValue({
      statusCode,
      message
    });

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(statusCode);
    expect(response.body).toEqual(message);
    expect(mockSetFinalScoreOfMatchService).toHaveBeenCalledWith({
      matchId,
      finalScore
    });
    expect.assertions(3);
  });

  it('should respond with HTTP 200 if setFinalScoreOfMatch executes successfully', async () => {
    mockSetFinalScoreOfMatchService.mockResolvedValue(undefined);

    const response = await apiHandler(handlerEvent, undefined, undefined) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(mockSetFinalScoreOfMatchService).toHaveBeenCalledWith({
      matchId,
      finalScore
    });
    expect.assertions(2);
  });
});
