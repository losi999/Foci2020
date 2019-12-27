import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { RegistrationRequest, LoginRequest } from '@/types/requests';

export interface IIdentityService {
  register(body: RegistrationRequest): Promise<any>;
  login(body: LoginRequest): Promise<CognitoIdentityServiceProvider.AdminInitiateAuthResponse>;
}

export const cognitoIdentityService = (cognito: CognitoIdentityServiceProvider): IIdentityService => {
  return {
    register: async (body) => {
      await cognito.adminCreateUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: body.email,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          {
            Name: 'email',
            Value: body.email,
          },
          {
            Name: 'nickname',
            Value: body.displayName,
          }]
      }).promise();

      await cognito.adminAddUserToGroup({
        UserPoolId: process.env.USER_POOL_ID,
        GroupName: 'player',
        Username: body.email
      }).promise();

      return cognito.adminSetUserPassword({
        UserPoolId: process.env.USER_POOL_ID,
        Password: body.password,
        Permanent: true,
        Username: body.email
      }).promise();
    },
    login: (body) => {
      return cognito.adminInitiateAuth({
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.CLIENT_ID,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: body.email,
          PASSWORD: body.password
        }
      }).promise();
    }
  };
};
