import { RegistrationRequest } from '@/types/requests';
import { IIdentityService } from '@/services/identity-service';
import { httpError } from '@/common';

export interface IRegistrationService {
  (ctx: {
    body: RegistrationRequest
  }): Promise<void>;
}

export const registrationServiceFactory = (identityService: IIdentityService): IRegistrationService => {
  return async ({ body }) => {

    await identityService.register(body).catch((error) => {
      console.error('Register', error);
      throw httpError(500, error.message);
    });
  };
};
