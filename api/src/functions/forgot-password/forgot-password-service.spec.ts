import { IForgotPasswordService, forgotPasswordServiceFactory } from '@foci2020/api/functions/forgot-password/forgot-password-service';
import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { ForgotPasswordRequest } from '@foci2020/shared/types/requests';

describe('Forgot password service', () => {
  let service: IForgotPasswordService;
  let mockIdentityService: Mock<IIdentityService>;

  beforeEach(() => {
    mockIdentityService = createMockService<IIdentityService>('forgotPassword');

    service = forgotPasswordServiceFactory(mockIdentityService.service);
  });

  it('should return with login credentials', async () => {
    const body = {} as ForgotPasswordRequest;

    mockIdentityService.functions.forgotPassword.mockResolvedValue(undefined);
    await service({
      body, 
    });
    validateFunctionCall(mockIdentityService.functions.forgotPassword, body);
  });

  it('should throw error if unable to forgot password', async () => {
    const body = {} as ForgotPasswordRequest;

    mockIdentityService.functions.forgotPassword.mockRejectedValue({
      message: 'This is a cognito error', 
    });

    await service({
      body, 
    }).catch(validateError('This is a cognito error', 500));
    validateFunctionCall(mockIdentityService.functions.forgotPassword, body);
    expect.assertions(3);
  });
});
