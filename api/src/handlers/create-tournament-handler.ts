import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ICreateTournamentService } from '@/business-services/create-tournament-service';
import { TournamentRequest } from '@/types';

export default (createTournament: ICreateTournamentService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const body = JSON.parse(event.body) as TournamentRequest;

    try {
      await createTournament({ body });
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
