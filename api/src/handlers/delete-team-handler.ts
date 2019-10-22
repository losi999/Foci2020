import { IDeleteTeamService } from '@/business-services/delete-team-service';
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';

export default (deleteTeam: IDeleteTeamService): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  return async (event) => {
    const { teamId } = event.pathParameters;
    try {
      await deleteTeam({ teamId });
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
