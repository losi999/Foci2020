import { apiRequestValidator, identityService } from '@/dependencies';
import { default as handler } from '@/functions/registration/registration-handler';
import { registrationServiceFactory } from '@/functions/registration/registration-service';
import { body } from '@/functions/registration/registration-schemas';

const registrationService = registrationServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(registrationService));
