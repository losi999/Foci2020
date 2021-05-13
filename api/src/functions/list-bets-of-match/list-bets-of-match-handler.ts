import { IListBetsOfMatchService } from '@foci2020/api/functions/list-bets-of-match/list-bets-of-match-service';
import { BetResponse } from '@foci2020/shared/types/responses';
import { MatchIdType, UserIdType } from '@foci2020/shared/types/common';

export default (listBetsOfMatch: IListBetsOfMatchService): AWSLambda.APIGatewayProxyHandler =>
  async (event) => {
    const matchId = event.pathParameters.matchId as MatchIdType;
    const userId = event.requestContext.authorizer.claims.sub as UserIdType;

    let bets: BetResponse[];
    try {
      bets = await listBetsOfMatch({
        matchId,
        userId,
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
      body: JSON.stringify(bets),
    };
  };
