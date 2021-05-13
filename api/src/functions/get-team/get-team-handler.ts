import { IGetTeamService } from '@foci2020/api/functions/get-team/get-team-service';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { TeamIdType } from '@foci2020/shared/types/common';

export default (getTeam: IGetTeamService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const teamId = event.pathParameters.teamId as TeamIdType;
    let team: TeamResponse;
    try {
      team = await getTeam({
        teamId, 
      });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(team),
    };
  };
};
