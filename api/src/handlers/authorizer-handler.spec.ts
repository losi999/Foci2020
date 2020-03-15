import { default as handler } from '@/handlers/authorizer-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Authorizer handler', () => {
  let authHandler: ReturnType<typeof handler>;
  let innerHandler: jest.Mock;

  beforeEach(() => {
    innerHandler = jest.fn();
    authHandler = handler();
  });

  it('should call inner handler if user type is accepted', async () => {
    const handlerEvent = {
      requestContext: {
        authorizer: {
          claims: {
            ['cognito:groups']: 'player,admin'
          }
        }
      } as any
    } as APIGatewayProxyEvent;

    await authHandler('player')(innerHandler)(handlerEvent, undefined, undefined);
    expect(innerHandler).toHaveBeenCalledTimes(1);
    expect.assertions(1);
  });

  it('should return 403 if user type is rejected', async () => {
    const handlerEvent = {
      requestContext: {
        authorizer: {
          claims: {
            ['cognito:groups']: 'admin'
          }
        }
      } as any
    } as APIGatewayProxyEvent;

    const result = await authHandler('player')(innerHandler)(handlerEvent, undefined, undefined) as APIGatewayProxyResult;
    expect(result.statusCode).toEqual(403);
    expect(innerHandler).not.toHaveBeenCalled();
    expect.assertions(2);
  });
});
