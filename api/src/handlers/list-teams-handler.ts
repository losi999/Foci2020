import { IListTeamsService } from '@/business-services/list-teams-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { TeamResponse } from '@/types/responses';

export default (listTeams: IListTeamsService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const { tournamentId } = event.queryStringParameters || {};
    let teams: TeamResponse[];
    try {
      teams = await listTeams({
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
      body: JSON.stringify(teams)
    };
  };
};
