import { IListTournamentsService } from '@/business-services/list-tournaments-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { TournamentResponse } from '@/types/responses';

export default (listTournaments: IListTournamentsService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    let tournaments: TournamentResponse[];
    try {
      tournaments = await listTournaments({});
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
