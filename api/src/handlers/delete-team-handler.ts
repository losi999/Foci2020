import { IDeleteTeamService } from '@/business-services/delete-team-service';
import { APIGatewayProxyHandler } from 'aws-lambda';

export default (deleteTeam: IDeleteTeamService): APIGatewayProxyHandler => {
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
