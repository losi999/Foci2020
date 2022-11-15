import { IForgotPasswordService } from '@foci2020/api/functions/forgot-password/forgot-password-service';

export default (forgotPassword: IForgotPasswordService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    try {
      await forgotPassword({
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
      body: '',
    };
  };
};
