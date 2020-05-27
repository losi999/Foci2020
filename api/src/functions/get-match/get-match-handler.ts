import { IGetMatchService } from '@foci2020/api/functions/get-match/get-match-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MatchResponse } from '@foci2020/shared/types/responses';

export default (getMatch: IGetMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const { matchId } = event.pathParameters;
    let match: MatchResponse;
    try {
      match = await getMatch({ matchId });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(match)
    };
  };
};
