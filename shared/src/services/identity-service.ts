import { RegistrationRequest, LoginRequest, RefreshTokenRequest, ForgotPasswordRequest, ConfirmForgotPasswordRequest } from '@foci2020/shared/types/requests';
import { UserType, UserIdType } from '@foci2020/shared/types/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export interface IIdentityService {
  getUserName(userId: UserIdType): Promise<string>;
  register(body: RegistrationRequest, userGroup: UserType): Promise<any>;
  login(body: LoginRequest): Promise<CognitoIdentityServiceProvider.AdminInitiateAuthResponse>;
  refreshToken(body: RefreshTokenRequest): Promise<CognitoIdentityServiceProvider.AdminInitiateAuthResponse>;
  forgotPassword(body: ForgotPasswordRequest): Promise<unknown>;
  confirmForgotPassword(body: ConfirmForgotPasswordRequest): Promise<unknown>;
}

export const identityServiceFactory = (
  userPoolId: string,
  clientId: string,
  cognito: CognitoIdentityServiceProvider): IIdentityService => {
  const instance: IIdentityService = {
    getUserName: async (userId) => {
      return (await cognito.adminGetUser({
        UserPoolId: userPoolId,
        Username: userId,
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
          },
          {
            Name: 'email_verified',
            Value: 'True',
          },
        ],
      }).promise();

      await cognito.adminAddUserToGroup({
        UserPoolId: userPoolId,
        GroupName: userGroup,
        Username: body.email,
      }).promise();

      return cognito.adminSetUserPassword({
        UserPoolId: userPoolId,
        Password: body.password,
        Permanent: true,
        Username: body.email,
      }).promise();
    },
    login: (body) => {
      return cognito.adminInitiateAuth({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: body.email,
          PASSWORD: body.password,
        },
      }).promise();
    },
    refreshToken: (body) => {
      return cognito.adminInitiateAuth({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: body.refreshToken,
        },
      }).promise();
    },
    forgotPassword: (body) => {
      return cognito.forgotPassword({
        ClientId: clientId,
        Username: body.email,
      }).promise();
    },
    confirmForgotPassword: (body) => {
      return cognito.confirmForgotPassword({
        ClientId: clientId,
        Username: body.email,
        ConfirmationCode: body.confirmationCode,
        Password: body.password,
      }).promise();
    },
  };

  return instance;
};
