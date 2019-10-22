import { IDeleteTournamentService } from '@/business-services/delete-tournament-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';

export default (deleteTournament: IDeleteTournamentService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const { tournamentId } = event.pathParameters;
    try {
      await deleteTournament({ tournamentId });
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
