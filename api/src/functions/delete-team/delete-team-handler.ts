import { IDeleteTeamService } from '@/functions/delete-team/delete-team-service';
import { APIGatewayProxyHandler } from 'aws-lambda';

export default (deleteTeam: IDeleteTeamService): APIGatewayProxyHandler => {
  return async (event) => {
    const { teamId } = event.pathParameters;
    try {
      await deleteTeam({ teamId });
    } catch (error) {
      console.error(error);
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
