import { IConfirmForgotPasswordService } from '@foci2020/api/functions/confirm-forgot-password/confirm-forgot-password-service';

export default (confirmForgotPassword: IConfirmForgotPasswordService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    try {
      await confirmForgotPassword({
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
