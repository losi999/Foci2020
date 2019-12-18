import { APIGatewayProxyHandler } from 'aws-lambda';
import { ILoginService } from '@/business-services/login-service';

export default (login: ILoginService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    let loginResponse;
    try {
      loginResponse = await login({
        body
      });
    } catch (error) {
      return {
        statusCode: error.statusCode,
        body: error.message
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(loginResponse),
    };
  };
};
