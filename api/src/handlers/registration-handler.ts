import { APIGatewayProxyHandler } from 'aws-lambda';
import { IRegistrationService } from '@/business-services/registration-service';

export default (registration: IRegistrationService): APIGatewayProxyHandler => {
  return async (event) => {
    const body = JSON.parse(event.body);

    try {
      await registration({
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
      body: '',
    };
  };
};
