import { IListMatchesService } from '@/functions/list-matches/list-matches-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MatchResponse } from '@/types/types';

export default (listMatches: IListMatchesService): APIGatewayProxyHandler => {
  return async () => {
    let matches: MatchResponse[];
    try {
      matches = await listMatches();
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
