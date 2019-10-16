import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IUpdateTournamentService } from '@/business-services/update-tournament-service';
import { TournamentRequest } from '@/types/requests';

export default (updateTournament: IUpdateTournamentService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const body = JSON.parse(event.body) as TournamentRequest;
    const { tournamentId } = event.pathParameters;

    try {
      await updateTournament({
        body,
        tournamentId
      });
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
