import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { httpError } from '@foci2020/shared/common/utils';
import { ConfirmForgotPasswordRequest } from '@foci2020/shared/types/requests';

export interface IConfirmForgotPasswordService {
  (ctx: {
    body: ConfirmForgotPasswordRequest
  }): Promise<void>;
}

export const confirmForgotPasswordServiceFactory = (identityService: IIdentityService): IConfirmForgotPasswordService => {
  return async ({ body }) => {
    await identityService.confirmForgotPassword(body).catch((error) => {
      console.error('Confirm forgot password', error);
      throw httpError(500, error.message);
    });
  };
};
