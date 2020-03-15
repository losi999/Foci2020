import { IDeleteTournamentService } from '@/functions/delete-tournament/delete-tournament-service';
import { APIGatewayProxyHandler } from 'aws-lambda';

export default (deleteTournament: IDeleteTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const { tournamentId } = event.pathParameters;
    try {
      await deleteTournament({ tournamentId });
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
