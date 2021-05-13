import { IListStandingsOfTournament } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-service';
import { StandingResponse } from '@foci2020/shared/types/responses';
import { TournamentIdType } from '@foci2020/shared/types/common';

export default (listStandingsOfTournament: IListStandingsOfTournament): AWSLambda.APIGatewayProxyHandler =>
  async (event) => {
    const tournamentId = event.pathParameters.tournamentId as TournamentIdType;

    let standings: StandingResponse[];
    try {
      standings = await listStandingsOfTournament({
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
      body: JSON.stringify(standings),
    };
  };
