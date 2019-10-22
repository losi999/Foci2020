import { IGetMatchService } from '@/business-services/get-match-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { MatchResponse } from '@/types/responses';

export default (getMatch: IGetMatchService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const { matchId } = event.pathParameters;
    let match: MatchResponse;
    try {
      match = await getMatch({ matchId });
    } catch (error) {
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
