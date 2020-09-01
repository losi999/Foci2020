import { APIGatewayProxyHandler } from 'aws-lambda';
import { IUpdateTournamentService } from '@foci2020/api/functions/update-tournament/update-tournament-service';
import { TournamentIdType } from '@foci2020/shared/types/common';
import { headerExpiresIn } from '@foci2020/shared/constants';

export default (updateTournament: IUpdateTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    const tournamentId = event.pathParameters.tournamentId as TournamentIdType;

    try {
      await updateTournament({
        body,
        tournamentId,
        expiresIn: Number(event.headers[headerExpiresIn])
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
