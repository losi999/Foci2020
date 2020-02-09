import { ILoginService, loginServiceFactory } from '@/user/login/login-service';
import { IIdentityService } from '@/shared/services/identity-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { LoginRequest, LoginResponse } from '@/shared/types/types';

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
    expect(mockIdentityService.functions.login).toHaveBeenCalledWith(body);
  });

  it('should throw error if unable to login', async () => {
    const body = {} as LoginRequest;

    mockIdentityService.functions.login.mockRejectedValue({ message: 'This is a cognito error' });

    await service({ body }).catch(validateError('This is a cognito error', 500));
    expect(mockIdentityService.functions.login).toHaveBeenCalledWith(body);
    expect.assertions(3);
  });
});
