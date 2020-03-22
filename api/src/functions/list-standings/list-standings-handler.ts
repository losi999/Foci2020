import { APIGatewayProxyHandler } from 'aws-lambda';
import { IListStandingsService } from '@/functions/list-standings/list-standings-service';

export default (listStandings: IListStandingsService): APIGatewayProxyHandler =>
  async (event) => {
    const tournamentId = event.pathParameters.tournamentId;

    await listStandings({ tournamentId });

    return {
      statusCode: 418,
      body: 'Teapot'
    };
  };
