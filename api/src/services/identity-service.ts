import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { RegistrationRequest, LoginRequest } from '@/types/types';

export interface IIdentityService {
  register(body: RegistrationRequest): Promise<any>;
  login(body: LoginRequest): Promise<CognitoIdentityServiceProvider.AdminInitiateAuthResponse>;
}

export const cognitoIdentityService = (
  userPoolId: string,
  clientId: string,
  cognito: CognitoIdentityServiceProvider): IIdentityService => {
  return {
    register: async (body) => {
      await cognito.adminCreateUser({
        UserPoolId: userPoolId,
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
        UserPoolId: userPoolId,
        GroupName: 'player',
        Username: body.email
      }).promise();

      return cognito.adminSetUserPassword({
        UserPoolId: userPoolId,
        Password: body.password,
        Permanent: true,
        Username: body.email
      }).promise();
    },
    login: (body) => {
      return cognito.adminInitiateAuth({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: body.email,
          PASSWORD: body.password
        }
      }).promise();
    }
  };
};
