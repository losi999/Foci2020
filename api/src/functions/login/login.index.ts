import { apiRequestValidator, identityService } from '@/dependencies';
import { default as handler } from '@/functions/login/login-handler';
import { loginServiceFactory } from '@/functions/login/login-service';
import { default as body } from '@/schemas/login';

const loginService = loginServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(loginService));
