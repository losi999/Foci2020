import { identityService } from '@foci2020/shared/dependencies/services/identity-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { default as handler } from '@foci2020/api/functions/refresh-token/refresh-token-handler';
import { refreshTokenServiceFactory } from '@foci2020/api/functions/refresh-token/refresh-token-service';
import { default as body } from '@foci2020/shared/schemas/refresh-token';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const refreshTokenService = refreshTokenServiceFactory(identityService);

export default cors(apiRequestValidator({
  body,
})(handler(refreshTokenService)));
