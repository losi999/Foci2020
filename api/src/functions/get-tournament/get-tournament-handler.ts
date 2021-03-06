import { IGetTournamentService } from '@foci2020/api/functions/get-tournament/get-tournament-service';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { TournamentIdType } from '@foci2020/shared/types/common';

export default (getTournament: IGetTournamentService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const tournamentId = event.pathParameters.tournamentId as TournamentIdType;
    let tournament: TournamentResponse;
    try {
      tournament = await getTournament({
        tournamentId, 
      });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(tournament),
    };
  };
};
