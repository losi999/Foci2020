import { APIGatewayProxyHandler } from 'aws-lambda';
import { ILoginService } from '@foci2020/api/functions/login/login-service';
import { LoginResponse } from '@foci2020/shared/types/responses';

export default (login: ILoginService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    let loginResponse: LoginResponse;
    try {
      loginResponse = await login({
        body
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
      body: JSON.stringify(loginResponse),
    };
  };
};
