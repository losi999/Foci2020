import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { IValidatorService } from '@/services/validator-service';
import { JSONSchema7 } from 'json-schema';

type RequestSchemaTypes = {
  body?: JSONSchema7;
  pathParameters?: JSONSchema7;
  queryStringParameters?: JSONSchema7;
};

const keys = <O extends object>(obj: O): (keyof O)[] => {
  return Object.keys(obj) as (keyof O)[];
};

export default (validatorService: IValidatorService) => {
  return (schemas: RequestSchemaTypes): ((handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>) => Handler<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
    return (handler) => {
      return async (event, context, callback) => {
        const validationErrors = keys(schemas).reduce((accumulator, currentValue) => {
          const validation = validatorService.validate(event[currentValue], schemas[currentValue], currentValue);
          if (validation) {
            accumulator.push(validation);
          }
          return accumulator;
        }, []);

        if (validationErrors.length > 0) {
          return {
            statusCode: 400,
            body: JSON.stringify(validationErrors)
          };
        }

        return handler(event, context, callback) as Promise<APIGatewayProxyResult>;
      };
    };
  };
};
