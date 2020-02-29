import { IListBetsOfMatchService } from '@/functions/list-bets-of-match/list-bets-of-match-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { BetResponse } from '@/types/types';

export default (listBetsOfMatch: IListBetsOfMatchService): APIGatewayProxyHandler =>
  async (event) => {
    const matchId = event.pathParameters.matchId;
    const userId = event.requestContext.authorizer.claims.sub;

    let bets: BetResponse[];
    try {
      bets = await listBetsOfMatch({
        matchId,
        userId
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
      body: JSON.stringify(bets)
    };
  };
