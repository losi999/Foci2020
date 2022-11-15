import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { httpError } from '@foci2020/shared/common/utils';
import { ForgotPasswordRequest } from '@foci2020/shared/types/requests';

export interface IForgotPasswordService {
  (ctx: {
    body: ForgotPasswordRequest
  }): Promise<void>;
}

export const forgotPasswordServiceFactory = (identityService: IIdentityService): IForgotPasswordService => {
  return async ({ body }) => {
    await identityService.forgotPassword(body).catch((error) => {
      console.error('Forgot password', error);
      throw httpError(500, error.message);
    });
  };
};
