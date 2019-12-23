import { apiRequestValidator, identityService } from '@/dependencies';
import { default as handler } from '@/handlers/login-handler';
import { loginServiceFactory } from '@/business-services/login-service';
import { body } from '@/schemas/login-schemas';

const loginService = loginServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(loginService));
