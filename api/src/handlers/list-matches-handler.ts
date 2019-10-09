import { IListMatchesService } from '@/business-services/list-matches-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { MatchResponse } from '@/types';

export default (listMatches: IListMatchesService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const { tournamentId } = event.queryStringParameters || {};
    let matches: MatchResponse[];
    try {
      matches = await listMatches({
        tournamentId
      });
    } catch (error) {
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(matches)
    };
  };
};
