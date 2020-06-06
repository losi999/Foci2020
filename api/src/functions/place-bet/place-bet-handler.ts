import { APIGatewayProxyHandler } from 'aws-lambda';
import { IPlaceBetService } from '@foci2020/api/functions/place-bet/place-bet-service';

export default (placeBet: IPlaceBetService): APIGatewayProxyHandler =>
  async (event) => {
    const matchId = event.pathParameters.matchId;
    const userId = event.requestContext.authorizer.claims.sub;
    const userName = event.requestContext.authorizer.claims.nickname;
    const bet = JSON.parse(event.body);

    try {
      await placeBet({
        matchId,
        userId,
        bet,
        userName,
        isTestData: !!event.headers['Foci2020-AutoTest']
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
