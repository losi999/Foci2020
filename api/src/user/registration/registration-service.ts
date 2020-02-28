import { IIdentityService } from '@/shared/services/identity-service';
import { httpError } from '@/shared/common';
import { RegistrationRequest } from '@/shared/types/types';

export interface IRegistrationService {
  (ctx: {
    body: RegistrationRequest
  }): Promise<void>;
}

export const registrationServiceFactory = (identityService: IIdentityService): IRegistrationService => {
  return async ({ body }) => {

    await identityService.register(body, 'player').catch((error) => {
      console.error('Register', error);
      throw httpError(500, error.message);
    });
  };
};
