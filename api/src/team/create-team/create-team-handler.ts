import { APIGatewayProxyHandler } from 'aws-lambda';
import { ICreateTeamService } from '@/team/create-team/create-team-service';

export default (createTeam: ICreateTeamService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    let teamId: string;
    try {
      teamId = await createTeam({ body });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ teamId })
    };
  };
};