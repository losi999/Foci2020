import { APIGatewayProxyHandler } from 'aws-lambda';
import { ISetFinalScoreOfMatchService } from '@foci2020/api/functions/set-final-score-of-match/set-final-score-of-match-service';
import { MatchIdType } from '@foci2020/shared/types/common';

export default (setFinalScore: ISetFinalScoreOfMatchService): APIGatewayProxyHandler =>
  async (event) => {
    const matchId = event.pathParameters.matchId as MatchIdType;
    const finalScore = JSON.parse(event.body);

    try {
      await setFinalScore({
        matchId,
        finalScore
      });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }

    return {
      statusCode: 200,
      body: ''
    };
  };
