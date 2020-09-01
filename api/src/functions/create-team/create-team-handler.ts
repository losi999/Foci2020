import { APIGatewayProxyHandler } from 'aws-lambda';
import { ICreateTeamService } from '@foci2020/api/functions/create-team/create-team-service';
import { headerExpiresIn } from '@foci2020/shared/constants';

export default (createTeam: ICreateTeamService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    let teamId: string;
    try {
      teamId = await createTeam({
        body,
        expiresIn: Number(event.headers[headerExpiresIn])
      });
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
