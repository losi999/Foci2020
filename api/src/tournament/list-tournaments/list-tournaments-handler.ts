import { IListTournamentsService } from '@/tournament/list-tournaments/list-tournaments-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TournamentResponse } from '@/shared/types/types';

export default (listTournaments: IListTournamentsService): APIGatewayProxyHandler => {
  return async () => {
    let tournaments: TournamentResponse[];
    try {
      tournaments = await listTournaments();
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(tournaments)
    };
  };
};
