import { RegistrationRequest, LoginRequest } from '@foci2020/shared/types/requests';
import { UserType } from '@foci2020/shared/types/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export interface IIdentityService {
  getUserName(userId: string): Promise<string>;
  register(body: RegistrationRequest, userGroup: UserType): Promise<any>;
  login(body: LoginRequest): Promise<CognitoIdentityServiceProvider.AdminInitiateAuthResponse>;
}

export const identityServiceFactory = (
  userPoolId: string,
  clientId: string,
  cognito: CognitoIdentityServiceProvider): IIdentityService => {
  const instance: IIdentityService = {
    getUserName: async (userId) => {
      return (await cognito.adminGetUser({
        UserPoolId: userPoolId,
        Username: userId
      }).promise()).UserAttributes.find(attr => attr.Name === 'nickname').Value;
    },
    register: async (body, userGroup) => {
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
        GroupName: userGroup,
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

  return instance;
};
