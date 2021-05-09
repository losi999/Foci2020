import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { httpError } from '@foci2020/shared/common/utils';
import { RefreshTokenRequest } from '@foci2020/shared/types/requests';
import { IdTokenResponse } from '@foci2020/shared/types/responses';

export interface IRefreshTokenService {
  (CTX: {
    body: RefreshTokenRequest
  }): Promise<IdTokenResponse>;
}

export const refreshTokenServiceFactory = (identityService: IIdentityService): IRefreshTokenService => {
  return async ({ body }) => {
    const loginResponse = await identityService.refreshToken(body).catch((error) => {
      console.error('Refresh token', error);
      throw httpError(500, error.message);
    });

    return {
      idToken: loginResponse.AuthenticationResult.IdToken,
    };
  };
};
