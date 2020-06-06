import { APIGatewayProxyHandler } from 'aws-lambda';
import { IUpdateTeamService } from '@foci2020/api/functions/update-team/update-team-service';

export default (updateTeam: IUpdateTeamService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    const { teamId } = event.pathParameters;

    try {
      await updateTeam({
        body,
        teamId,
        isTestData: !!event.headers['Foci2020-AutoTest']
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
      body: ''
    };
  };
};
