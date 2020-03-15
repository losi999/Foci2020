import { IIdentityService } from '@/services/identity-service';
import { httpError } from '@/common';
import { RegistrationRequest } from '@/types/types';

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
