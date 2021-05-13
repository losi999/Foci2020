import { IListMatchesService } from '@foci2020/api/functions/list-matches/list-matches-service';
import { MatchResponse } from '@foci2020/shared/types/responses';

export default (listMatches: IListMatchesService): AWSLambda.APIGatewayProxyHandler => {
  return async () => {
    let matches: MatchResponse[];
    try {
      matches = await listMatches();
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(matches),
    };
  };
};
