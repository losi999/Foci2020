import { apiRequestValidator, identityService } from '@/shared/dependencies';
import { default as handler } from '@/user/login/login-handler';
import { loginServiceFactory } from '@/user/login/login-service';
import { body } from '@/user/login/login-schemas';

const loginService = loginServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(loginService));
