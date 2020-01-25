import { IGetTournamentService } from '@/business-services/get-tournament-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TournamentResponse } from '@/types/responses';

export default (getTournament: IGetTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const { tournamentId } = event.pathParameters;
    let tournament: TournamentResponse;
    try {
      tournament = await getTournament({ tournamentId });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(tournament)
    };
  };
};
