import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IUpdateTeamService } from '@/business-services/update-team-service';
import { TeamRequest } from '@/types/requests';

export default (updateTeam: IUpdateTeamService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const body = JSON.parse(event.body) as TeamRequest;
    const { teamId } = event.pathParameters;

    try {
      await updateTeam({
        body,
        teamId
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
