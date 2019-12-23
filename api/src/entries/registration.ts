import { apiRequestValidator, identityService } from '@/dependencies';
import { default as handler } from '@/handlers/registration-handler';
import { registrationServiceFactory } from '@/business-services/registration-service';
import { body } from '@/schemas/registration-schemas';

const registrationService = registrationServiceFactory(identityService);

export default apiRequestValidator({
  body
})(handler(registrationService));
