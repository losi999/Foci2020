import { identityService } from '@foci2020/shared/dependencies/services/identity-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { default as handler } from '@foci2020/api/functions/login/login-handler';
import { loginServiceFactory } from '@foci2020/api/functions/login/login-service';
import { default as body } from '@foci2020/shared/schemas/login';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const loginService = loginServiceFactory(identityService);

export default cors(apiRequestValidator({
  body,
})(handler(loginService)));
