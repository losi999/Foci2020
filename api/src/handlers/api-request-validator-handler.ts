import { IValidatorService } from '@/services/validator-service';
import { JSONSchema7 } from 'json-schema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

type RequestSchemaTypes = {
  body?: JSONSchema7;
  pathParameters?: JSONSchema7;
  queryStringParameters?: JSONSchema7;
};

const keys = <O extends object>(obj: O): (keyof O)[] => {
  return Object.keys(obj) as (keyof O)[];
};

export default (validatorService: IValidatorService) => {
  return (schemas: RequestSchemaTypes): ((handler: APIGatewayProxyHandler) => APIGatewayProxyHandler) => {
    return (handler) => {
      return async (event, context, callback) => {
        const validationErrors = keys(schemas).reduce((accumulator, currentValue) => {
          const validation = validatorService.validate(event[currentValue], schemas[currentValue]);
          if (validation) {
            return {
              ...accumulator,
              [currentValue]: validation
            };
          }
          return accumulator;
        }, {});

        if (Object.values(validationErrors).length > 0) {
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
