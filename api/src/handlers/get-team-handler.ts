import { IGetTeamService } from '@/business-services/get-team-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { TeamResponse } from '@/types/responses';

export default (getTeam: IGetTeamService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const { teamId } = event.pathParameters;
    let team: TeamResponse;
    try {
      team = await getTeam({ teamId });
    } catch (error) {
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(team)
    };
  };
};
