import { IGetDefaultTournamentIdService } from '@foci2020/api/functions/get-default-tournament-id/get-default-tournament-id-service';

export default (getDefaultTournamentId: IGetDefaultTournamentIdService): AWSLambda.APIGatewayProxyHandler => {
  return async () => {
    let tournamentId: string;
    try {
      tournamentId = await getDefaultTournamentId();
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        tournamentId,
      }),
    };
  };
};
