import { APIGatewayProxyHandler } from 'aws-lambda';
import { ICreateTournamentService } from '@foci2020/api/functions/create-tournament/create-tournament-service';

export default (createTournament: ICreateTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    let tournamentId: string;
    try {
      tournamentId = await createTournament({ body });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ tournamentId })
    };
  };
};
