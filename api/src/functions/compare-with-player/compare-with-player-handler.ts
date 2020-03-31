import { ICompareWithPlayerService } from '@/functions/compare-with-player/compare-with-player-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { CompareResponse } from '@/types/types';

export default (compareWithPlayer: ICompareWithPlayerService): APIGatewayProxyHandler =>
  async (event) => {
    const tournamentId = event.pathParameters.tournamentId;
    const otherUserId = event.pathParameters.userId;
    const ownUserId = event.requestContext.authorizer.claims.sub;
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
        body: error.message
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(compare)
    };
  };
