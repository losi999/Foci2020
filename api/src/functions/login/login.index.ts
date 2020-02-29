import { apiRequestValidator, identityService } from '@/dependencies';
import { default as handler } from '@/functions/login/login-handler';
import { loginServiceFactory } from '@/functions/login/login-service';
import { body } from '@/functions/login/login-schemas';

const loginService = loginServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(loginService));
