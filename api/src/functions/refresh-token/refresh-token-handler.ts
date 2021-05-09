import { APIGatewayProxyHandler } from 'aws-lambda';
import { IRefreshTokenService } from '@foci2020/api/functions/refresh-token/refresh-token-service';
import { IdTokenResponse } from '@foci2020/shared/types/responses';

export default (refreshToken: IRefreshTokenService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);
    let loginResponse: IdTokenResponse;
    try {
      loginResponse = await refreshToken({
        body,
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
      body: JSON.stringify(loginResponse),
    };
  };
};
