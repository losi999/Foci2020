import { APIGatewayProxyHandler } from 'aws-lambda';
import { ICreateMatchService } from '@foci2020/api/functions/create-match/create-match-service';
import { headerExpiresIn } from '@foci2020/shared/constants';

export default (createMatch: ICreateMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    let matchId: string;
    try {
      matchId = await createMatch({
        body,
        expiresIn: Number(event.headers[headerExpiresIn]),
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
      body: JSON.stringify({
        matchId, 
      }),
    };
  };
};
