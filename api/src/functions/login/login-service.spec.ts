import { ILoginService, loginServiceFactory } from '@foci2020/api/functions/login/login-service';
import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { LoginResponse } from '@foci2020/shared/types/responses';
import { LoginRequest } from '@foci2020/shared/types/requests';

describe('Login service', () => {
  let service: ILoginService;
  let mockIdentityService: Mock<IIdentityService>;

  beforeEach(() => {
    mockIdentityService = createMockService<IIdentityService>('login');

    service = loginServiceFactory(mockIdentityService.service);
  });

  it('should return with login credentials', async () => {
    const body = {} as LoginRequest;
    const idToken = 'some.id.token';
    const refreshToken = 'some.refresh.token';

    mockIdentityService.functions.login.mockResolvedValue({
      AuthenticationResult: {
        IdToken: idToken,
        RefreshToken: refreshToken
      }
    });

    const expectedResult: LoginResponse = {
      idToken,
      refreshToken
    };

    const result = await service({ body });
    expect(result).toEqual(expectedResult);
    validateFunctionCall(mockIdentityService.functions.login, body);
  });

  it('should throw error if unable to login', async () => {
    const body = {} as LoginRequest;

    mockIdentityService.functions.login.mockRejectedValue({ message: 'This is a cognito error' });

    await service({ body }).catch(validateError('This is a cognito error', 500));
    validateFunctionCall(mockIdentityService.functions.login, body);
    expect.assertions(3);
  });
});
