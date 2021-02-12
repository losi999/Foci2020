import { IIdentityService, identityServiceFactory } from '@foci2020/shared/services/identity-service';
import { Mock, createMockService, awsResolvedValue } from '@foci2020/shared/common/unit-testing';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UserIdType } from '@foci2020/shared/types/common';

describe('Notification service', () => {
  let service: IIdentityService;
  const userPoolId = 'UserPoolId';
  const clientId = 'ClientId';
  let mockCognito: Mock<CognitoIdentityServiceProvider>;

  beforeEach(() => {
    mockCognito = createMockService('adminInitiateAuth', 'adminCreateUser', 'adminAddUserToGroup', 'adminSetUserPassword', 'adminGetUser');

    service = identityServiceFactory(userPoolId, clientId, mockCognito.service);
  });

  describe('register', () => {
    it('should call cognito operations with correct parameters', async () => {
      const displayName = 'displayName';
      const email = 'email';
      const password = 'password';

      mockCognito.functions.adminCreateUser.mockReturnValue(awsResolvedValue());
      mockCognito.functions.adminAddUserToGroup.mockReturnValue(awsResolvedValue());
      mockCognito.functions.adminSetUserPassword.mockReturnValue(awsResolvedValue());

      await service.register({
        displayName,
        email,
        password,
      }, 'player');
      expect(mockCognito.functions.adminCreateUser).toHaveBeenCalledWith({
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
          },
        ],
      });
      expect(mockCognito.functions.adminAddUserToGroup).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        GroupName: 'player',
        Username: email,
      });
      expect(mockCognito.functions.adminSetUserPassword).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        Password: password,
        Permanent: true,
        Username: email,
      });
    });
  });

  describe('login', () => {
    it('should call cognito operations with correct parameters', async () => {
      const email = 'email';
      const password = 'password';

      mockCognito.functions.adminInitiateAuth.mockReturnValue(awsResolvedValue());

      await service.login({
        email,
        password,
      });

      expect(mockCognito.functions.adminInitiateAuth).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });
    });
  });

  describe('getUserName', () => {
    it('should call cognito operation with correct parameters and return "nickname" attribute', async () => {
      const nickname = 'Nick Name';
      const userId = 'userId' as UserIdType;

      mockCognito.functions.adminGetUser.mockReturnValue(awsResolvedValue({
        UserAttributes: [
          {
            Name: 'nickname',
            Value: nickname,
          },
        ],
      }));

      const result = await service.getUserName(userId);
      expect(result).toEqual(nickname);
      expect(mockCognito.functions.adminGetUser).toHaveBeenCalledWith({
        UserPoolId: userPoolId,
        Username: userId,
      });
    });
  });
});
