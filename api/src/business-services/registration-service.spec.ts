import { IRegistrationService, registrationServiceFactory } from '@/business-services/registration-service';
import { IIdentityService } from '@/services/identity-service';
import { Mock, createMockService } from '@/common';
import { RegistrationRequest } from '@/types/requests';

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

    const result = await service({ body });
    expect(result).toBeUndefined();
    expect(mockIdentityService.functions.register).toHaveBeenCalledWith(body);
  });

  it('should throw error if unable to register', async () => {
    const body = {} as RegistrationRequest;

    mockIdentityService.functions.register.mockRejectedValue({ message: 'This is a cognito error' });

    try {
      await service({ body });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('This is a cognito error');
    }
  });
});
