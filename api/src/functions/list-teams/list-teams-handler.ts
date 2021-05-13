import { IListTeamsService } from '@foci2020/api/functions/list-teams/list-teams-service';
import { TeamResponse } from '@foci2020/shared/types/responses';

export default (listTeams: IListTeamsService): AWSLambda.APIGatewayProxyHandler => {
  return async () => {
    let teams: TeamResponse[];
    try {
      teams = await listTeams();
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(teams),
    };
  };
};
