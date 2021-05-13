import { ICompareWithPlayerService } from '@foci2020/api/functions/compare-with-player/compare-with-player-service';
import { CompareResponse } from '@foci2020/shared/types/responses';
import { TournamentIdType, UserIdType } from '@foci2020/shared/types/common';

export default (compareWithPlayer: ICompareWithPlayerService): AWSLambda.APIGatewayProxyHandler =>
  async (event) => {
    const tournamentId = event.pathParameters.tournamentId as TournamentIdType;
    const otherUserId = event.pathParameters.userId as UserIdType;
    const ownUserId = event.requestContext.authorizer.claims.sub as UserIdType;
    const ownUserName = event.requestContext.authorizer.claims.nickname;

    let compare: CompareResponse;
    try {
      compare = await compareWithPlayer({
        tournamentId,
        ownUserId,
        otherUserId,
        ownUserName,
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
      body: JSON.stringify(compare),
    };
  };
