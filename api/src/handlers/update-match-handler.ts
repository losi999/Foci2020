import { APIGatewayProxyHandler } from 'aws-lambda';
import { IUpdateMatchService } from '@/business-services/update-match-service';

export default (updateMatch: IUpdateMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const { matchId } = event.pathParameters;
    const body = JSON.parse(event.body);

    try {
      await updateMatch({
        body,
        matchId
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
      body: ''
    };
  };
};
