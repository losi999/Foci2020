import { APIGatewayProxyHandler } from 'aws-lambda';
import { IUpdateTournamentService } from '@/functions/update-tournament/update-tournament-service';

export default (updateTournament: IUpdateTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    const { tournamentId } = event.pathParameters;

    try {
      await updateTournament({
        body,
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
      body: ''
    };
  };
};
