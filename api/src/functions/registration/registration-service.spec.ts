import { IRegistrationService, registrationServiceFactory } from '@foci2020/api/functions/registration/registration-service';
import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { RegistrationRequest } from '@foci2020/shared/types/requests';

describe('Registration service', () => {
  let service: IRegistrationService;
  let mockIdentityService: Mock<IIdentityService>;

  beforeEach(() => {
    mockIdentityService = createMockService<IIdentityService>('register');

    service = registrationServiceFactory(mockIdentityService.service);
  });

  it('should return with undefined', async () => {
    const body = {} as RegistrationRequest;

    mockIdentityService.functions.register.mockResolvedValue(undefined);

    const result = await service({
      body, 
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockIdentityService.functions.register, body, 'player');
  });

  it('should throw error if unable to register', async () => {
    const body = {} as RegistrationRequest;

    mockIdentityService.functions.register.mockRejectedValue({
      message: 'This is a cognito error', 
    });

    await service({
      body, 
    }).catch(validateError('This is a cognito error', 500));
    validateFunctionCall(mockIdentityService.functions.register, body, 'player');
    expect.assertions(3);
  });
});
