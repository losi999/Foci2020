import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { httpError } from '@foci2020/shared/common/utils';
import { LoginRequest } from '@foci2020/shared/types/requests';
import { LoginResponse } from '@foci2020/shared/types/responses';

export interface ILoginService {
  (CTX: {
    body: LoginRequest
  }): Promise<LoginResponse>;
}

export const loginServiceFactory = (identityService: IIdentityService): ILoginService => {
  return async ({ body }) => {
    const loginResponse = await identityService.login(body).catch((error) => {
      console.error('Login', error);
      throw httpError(500, error.message);
    });

    return {
      idToken: loginResponse.AuthenticationResult.IdToken,
      refreshToken: loginResponse.AuthenticationResult.RefreshToken
    };
  };
};
