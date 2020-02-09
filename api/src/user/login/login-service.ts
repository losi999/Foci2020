import { IIdentityService } from '@/shared/services/identity-service';
import { httpError } from '@/shared/common';
import { LoginRequest, LoginResponse } from '@/shared/types/types';

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
