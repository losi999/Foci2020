import { IIdentityService, cognitoIdentityService } from '@/services/identity-service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

describe('Notification service', () => {
  let service: IIdentityService;
  let cognitoAdminInitiateAuthSpy: jest.SpyInstance;
  let cognitoAdminCreateUserSpy: jest.SpyInstance;
  let cognitoAdminAddUserToGroupSpy: jest.SpyInstance;
  let cognitoAdminSetUserPasswordSpy: jest.SpyInstance;
  const userPoolId = 'UserPoolId';
  const clientId = 'ClientId';

  beforeEach(() => {
    const cognito = new CognitoIdentityServiceProvider();

    cognitoAdminInitiateAuthSpy = jest.spyOn(cognito, 'adminInitiateAuth');
    cognitoAdminCreateUserSpy = jest.spyOn(cognito, 'adminCreateUser');
    cognitoAdminAddUserToGroupSpy = jest.spyOn(cognito, 'adminAddUserToGroup');
    cognitoAdminSetUserPasswordSpy = jest.spyOn(cognito, 'adminSetUserPassword');

    process.env.USER_POOL_ID = userPoolId;
    process.env.CLIENT_ID = clientId;

    service = cognitoIdentityService(cognito);
  });

  afterEach(() => {
    process.env.USER_POOL_ID = undefined;
    process.env.CLIENT_ID = undefined;
  });

  describe('register', () => {
    it('should call cognito operations with correct parameters', async () => {
      const displayName = 'displayName';
      const email = 'email';
      const password = 'password';

      cognitoAdminCreateUserSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      cognitoAdminAddUserToGroupSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      cognitoAdminSetUserPasswordSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.register({
        displayName,
        email,
        password
      });
      expect(cognitoAdminCreateUserSpy).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        Username: email,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'nickname',
            Value: displayName,
          }]
      });
      expect(cognitoAdminAddUserToGroupSpy).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        GroupName: 'player',
        Username: email
      });
      expect(cognitoAdminSetUserPasswordSpy).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        Password: password,
        Permanent: true,
        Username: email
      });
    });
  });

  describe('login', () => {
    it('should call cognito operations with correct parameters', async () => {
      const email = 'email';
      const password = 'password';

      cognitoAdminInitiateAuthSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });

      await service.login({
        email,
        password
      });

      expect(cognitoAdminInitiateAuthSpy).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });
    });
  });
});
