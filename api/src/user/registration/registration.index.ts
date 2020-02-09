import { apiRequestValidator, identityService } from '@/shared/dependencies';
import { default as handler } from '@/user/registration/registration-handler';
import { registrationServiceFactory } from '@/user/registration/registration-service';
import { body } from '@/user/registration/registration-schemas';

const registrationService = registrationServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(registrationService));
