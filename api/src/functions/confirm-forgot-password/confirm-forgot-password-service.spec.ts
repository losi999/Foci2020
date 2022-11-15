import { IConfirmForgotPasswordService, confirmForgotPasswordServiceFactory } from '@foci2020/api/functions/confirm-forgot-password/confirm-forgot-password-service';
import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { ConfirmForgotPasswordRequest } from '@foci2020/shared/types/requests';

describe('Confirm forgot password service', () => {
  let service: IConfirmForgotPasswordService;
  let mockIdentityService: Mock<IIdentityService>;

  beforeEach(() => {
    mockIdentityService = createMockService<IIdentityService>('confirmForgotPassword');

    service = confirmForgotPasswordServiceFactory(mockIdentityService.service);
  });

  it('should return', async () => {
    const body = {} as ConfirmForgotPasswordRequest;

    mockIdentityService.functions.confirmForgotPassword.mockResolvedValue(undefined);
    await service({
      body, 
    });
    validateFunctionCall(mockIdentityService.functions.confirmForgotPassword, body);
  });

  it('should throw error if unable to confirm forgot password', async () => {
    const body = {} as ConfirmForgotPasswordRequest;

    mockIdentityService.functions.confirmForgotPassword.mockRejectedValue({
      message: 'This is a cognito error', 
    });

    await service({
      body, 
    }).catch(validateError('This is a cognito error', 500));
    validateFunctionCall(mockIdentityService.functions.confirmForgotPassword, body);
    expect.assertions(3);
  });
});
