import { IListMatchesOfTournamentService } from '@foci2020/api/functions/list-matches-of-tournament/list-matches-of-tournament-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { TournamentIdType } from '@foci2020/shared/types/common';

export default (listMatchesOfTournament: IListMatchesOfTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const tournamentId = event.pathParameters.tournamentId as TournamentIdType;

    let matches: MatchResponse[];
    try {
      matches = await listMatchesOfTournament({
        tournamentId, 
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
      body: JSON.stringify(matches),
    };
  };
};
