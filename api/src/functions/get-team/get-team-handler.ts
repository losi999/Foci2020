import { IGetTeamService } from '@foci2020/api/functions/get-team/get-team-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TeamResponse } from '@foci2020/shared/types/responses';

export default (getTeam: IGetTeamService): APIGatewayProxyHandler => {
  return async (event) => {
    const { teamId } = event.pathParameters;
    let team: TeamResponse;
    try {
      team = await getTeam({ teamId });
    } catch (error) {
      console.error(error);
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
