import { IListTournamentsService } from '@/business-services/list-tournaments-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TournamentResponse } from '@/types/responses';

export default (listTournaments: IListTournamentsService): APIGatewayProxyHandler => {
  return async () => {
    let tournaments: TournamentResponse[];
    try {
      tournaments = await listTournaments();
    } catch (error) {
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
