import { identityService } from '@foci2020/shared/dependencies/services/identity-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { default as handler } from '@foci2020/api/functions/confirm-forgot-password/confirm-forgot-password-handler';
import { default as body } from '@foci2020/shared/schemas/confirm-forgot-password';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';
import { confirmForgotPasswordServiceFactory } from '@foci2020/api/functions/confirm-forgot-password/confirm-forgot-password-service';

const confirmForgotPasswordService = confirmForgotPasswordServiceFactory(identityService);

export default cors(apiRequestValidator({
  body,
})(handler(confirmForgotPasswordService)));
