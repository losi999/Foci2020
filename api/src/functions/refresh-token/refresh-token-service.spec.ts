import { IRefreshTokenService, refreshTokenServiceFactory } from '@foci2020/api/functions/refresh-token/refresh-token-service';
import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IdTokenResponse } from '@foci2020/shared/types/responses';
import { RefreshTokenRequest } from '@foci2020/shared/types/requests';

describe('Refresh token service', () => {
  let service: IRefreshTokenService;
  let mockIdentityService: Mock<IIdentityService>;

  beforeEach(() => {
    mockIdentityService = createMockService<IIdentityService>('refreshToken');

    service = refreshTokenServiceFactory(mockIdentityService.service);
  });
  
  const body = {} as RefreshTokenRequest;
  const idToken = 'some.id.token';
  it('should return with id token', async () => {

    mockIdentityService.functions.refreshToken.mockResolvedValue({
      AuthenticationResult: {
        IdToken: idToken,
      },
    });

    const expectedResult: IdTokenResponse = {
      idToken,
    };

    const result = await service({
      body, 
    });
    expect(result).toEqual(expectedResult);
    validateFunctionCall(mockIdentityService.functions.refreshToken, body);
  });

  it('should throw error if unable to refresh token', async () => {
    mockIdentityService.functions.refreshToken.mockRejectedValue({
      message: 'This is a cognito error', 
    });

    await service({
      body, 
    }).catch(validateError('This is a cognito error', 500));
    validateFunctionCall(mockIdentityService.functions.refreshToken, body);
    expect.assertions(3);
  });
});
