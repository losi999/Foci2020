import { identityService } from '@foci2020/shared/dependencies/services/identity-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { default as handler } from '@foci2020/api/functions/registration/registration-handler';
import { registrationServiceFactory } from '@foci2020/api/functions/registration/registration-service';
import { default as body } from '@foci2020/shared/schemas/registration';

const registrationService = registrationServiceFactory(identityService);

export default apiRequestValidator({
  body, 
})(handler(registrationService));
