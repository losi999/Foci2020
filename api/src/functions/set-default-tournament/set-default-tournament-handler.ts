import { ISetDefaultTournamentService } from '@foci2020/api/functions/set-default-tournament/set-default-tournament-service';
import { TournamentId } from '@foci2020/shared/types/common';

export default (setDefaultTournament: ISetDefaultTournamentService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body) as TournamentId;
    try {
      await setDefaultTournament(body);
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        tournamentId: body.tournamentId,
      }),
    };
  };
};
