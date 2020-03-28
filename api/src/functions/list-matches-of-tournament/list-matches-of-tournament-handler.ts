import { IListMatchesOfTournamentService } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MatchResponse } from '@/types/types';

export default (listMatchesOfTournament: IListMatchesOfTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const tournamentId = event.pathParameters.tournamentId;

    let matches: MatchResponse[];
    try {
      matches = await listMatchesOfTournament({ tournamentId });
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(matches)
    };
  };
};
