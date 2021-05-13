import { IListTournamentsService } from '@foci2020/api/functions/list-tournaments/list-tournaments-service';
import { TournamentResponse } from '@foci2020/shared/types/responses';

export default (listTournaments: IListTournamentsService): AWSLambda.APIGatewayProxyHandler => {
  return async () => {
    let tournaments: TournamentResponse[];
    try {
      tournaments = await listTournaments();
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(tournaments),
    };
  };
};
