import { APIGatewayProxyHandler } from 'aws-lambda';
import { IUpdateMatchService } from '@foci2020/api/functions/update-match/update-match-service';
import { MatchIdType } from '@foci2020/shared/types/common';
import { headerExpiresIn } from '@foci2020/shared/constants';

export default (updateMatch: IUpdateMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const matchId = event.pathParameters.matchId as MatchIdType;
    const body = JSON.parse(event.body);

    try {
      await updateMatch({
        body,
        matchId,
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
