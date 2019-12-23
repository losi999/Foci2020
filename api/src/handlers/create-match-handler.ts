import { APIGatewayProxyHandler } from 'aws-lambda';
import { ICreateMatchService } from '@/business-services/create-match-service';
import { MatchRequest } from '@/types/requests';

export default (createMatch: ICreateMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body) as MatchRequest;

    try {
      await createMatch({ body });
    } catch (error) {
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
