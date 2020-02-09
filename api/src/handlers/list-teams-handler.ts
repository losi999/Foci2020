import { IListTeamsService } from '@/business-services/list-teams-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TeamResponse } from '@/types/types';

export default (listTeams: IListTeamsService): APIGatewayProxyHandler => {
  return async () => {
    let teams: TeamResponse[];
    try {
      teams = await listTeams();
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(teams)
    };
  };
};
