import { IListMatchesService } from '@/business-services/list-matches-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MatchResponse } from '@/types/responses';

export default (listMatches: IListMatchesService): APIGatewayProxyHandler => {
  return async (event) => {
    const { tournamentId } = event.queryStringParameters || {};
    let matches: MatchResponse[];
    try {
      matches = await listMatches({
        tournamentId
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
      body: JSON.stringify(matches)
    };
  };
};
