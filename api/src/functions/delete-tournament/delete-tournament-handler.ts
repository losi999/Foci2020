import { IDeleteTournamentService } from '@foci2020/api/functions/delete-tournament/delete-tournament-service';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { TournamentIdType } from '@foci2020/shared/types/common';

export default (deleteTournament: IDeleteTournamentService): APIGatewayProxyHandler => {
  return async (event) => {
    const tournamentId = event.pathParameters.tournamentId as TournamentIdType;
    try {
      await deleteTournament({ tournamentId });
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
