import { APIGatewayProxyHandler } from 'aws-lambda';
import { ILoginService } from '@/user/login/login-service';
import { LoginResponse } from '@/shared/types/types';

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
