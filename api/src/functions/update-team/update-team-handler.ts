import { IUpdateTeamService } from '@foci2020/api/functions/update-team/update-team-service';
import { TeamIdType } from '@foci2020/shared/types/common';
import { headerExpiresIn } from '@foci2020/shared/constants';

export default (updateTeam: IUpdateTeamService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    const teamId = event.pathParameters.teamId as TeamIdType;

    try {
      await updateTeam({
        body,
        teamId,
        expiresIn: Number(event.headers[headerExpiresIn]),
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
      body: '',
    };
  };
};
