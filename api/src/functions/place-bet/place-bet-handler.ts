import { APIGatewayProxyHandler } from 'aws-lambda';
import { IPlaceBetService } from '@foci2020/api/functions/place-bet/place-bet-service';
import { MatchIdType, UserIdType } from '@foci2020/shared/types/common';
import { headerExpiresIn } from '@foci2020/shared/constants';

export default (placeBet: IPlaceBetService): APIGatewayProxyHandler =>
  async (event) => {
    const matchId = event.pathParameters.matchId as MatchIdType;
    const userId = event.requestContext.authorizer.claims.sub as UserIdType;
    const userName = event.requestContext.authorizer.claims.nickname;
    const bet = JSON.parse(event.body);

    try {
      await placeBet({
        matchId,
        userId,
        bet,
        userName,
        expiresIn: Number(event.headers[headerExpiresIn]),
      });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: '',
    };
  };
