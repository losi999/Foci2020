import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ICreateTeamService } from '@/business-services/create-team-service';
import { TeamRequest } from '@/types/requests';

export default (createTeam: ICreateTeamService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const body = JSON.parse(event.body) as TeamRequest;

    try {
      await createTeam({ body });
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
