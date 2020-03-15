import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UserType } from '@/types/types';

export default () =>
  (...userTypes: UserType[]) =>
    (handler: APIGatewayProxyHandler): APIGatewayProxyHandler =>
      async (event, context, callback) => {
        const groups = event.requestContext.authorizer.claims['cognito:groups'].split(',');

        if (!userTypes.some(u => groups.includes(u))) {
          return {
            statusCode: 403,
            body: ''
          };
        }
        return handler(event, context, callback) as Promise<APIGatewayProxyResult>;
      };
