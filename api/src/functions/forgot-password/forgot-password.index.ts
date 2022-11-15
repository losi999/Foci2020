import { identityService } from '@foci2020/shared/dependencies/services/identity-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { default as handler } from '@foci2020/api/functions/forgot-password/forgot-password-handler';
import { default as body } from '@foci2020/shared/schemas/forgot-password';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';
import { forgotPasswordServiceFactory } from '@foci2020/api/functions/forgot-password/forgot-password-service';

const forgotPasswordService = forgotPasswordServiceFactory(identityService);

export default cors(apiRequestValidator({
  body,
})(handler(forgotPasswordService)));
