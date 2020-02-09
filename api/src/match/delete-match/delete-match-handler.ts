import { IDeleteMatchService } from '@/match/delete-match/delete-match-service';
import { APIGatewayProxyHandler } from 'aws-lambda';

export default (deleteMatch: IDeleteMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const { matchId } = event.pathParameters;
    try {
      await deleteMatch({ matchId });
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
