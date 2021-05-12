import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { httpError } from '@foci2020/shared/common/utils';
import { RegistrationRequest } from '@foci2020/shared/types/requests';

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
