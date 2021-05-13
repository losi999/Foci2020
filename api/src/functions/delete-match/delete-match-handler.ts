import { IDeleteMatchService } from '@foci2020/api/functions/delete-match/delete-match-service';
import { MatchIdType } from '@foci2020/shared/types/common';

export default (deleteMatch: IDeleteMatchService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const matchId = event.pathParameters.matchId as MatchIdType;
    try {
      await deleteMatch({
        matchId, 
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
};
