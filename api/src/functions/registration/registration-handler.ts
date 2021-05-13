import { IRegistrationService } from '@foci2020/api/functions/registration/registration-service';

export default (registration: IRegistrationService): AWSLambda.APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    try {
      await registration({
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
