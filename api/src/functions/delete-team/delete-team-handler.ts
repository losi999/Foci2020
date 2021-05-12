import { IDeleteTeamService } from '@foci2020/api/functions/delete-team/delete-team-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TeamIdType } from '@foci2020/shared/types/common';

export default (deleteTeam: IDeleteTeamService): APIGatewayProxyHandler => {
  return async (event) => {
    const teamId = event.pathParameters.teamId as TeamIdType;
    try {
      await deleteTeam({
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
      body: '',
    };
  };
};
