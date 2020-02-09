import { IIdentityService } from '@/services/identity-service';
import { httpError } from '@/common';
import { LoginRequest, LoginResponse } from '@/types/types';

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
