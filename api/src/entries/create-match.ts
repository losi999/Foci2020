import uuid from 'uuid';
import { default as handler } from '@/handlers/create-match-handler';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { validatorService, databaseService } from '@/dependencies';
import { default as body } from '@/schemas/create-match-schemas';
import { createMatchServiceFactory } from '@/business-services/create-match-service';

const createMatchService = createMatchServiceFactory(databaseService, uuid);

export default apiRequestValidatorHandler(validatorService)({
  body
})(handler(createMatchService));
