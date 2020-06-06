import { APIGatewayProxyHandler } from 'aws-lambda';
import { ICreateMatchService } from '@foci2020/api/functions/create-match/create-match-service';

export default (createMatch: ICreateMatchService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    let matchId: string;
    try {
      matchId = await createMatch({
        body,
        isTestData: !!event.headers['Foci2020-AutoTest']
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
      body: JSON.stringify({ matchId })
    };
  };
};
