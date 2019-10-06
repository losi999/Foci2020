import uuid from 'uuid';
import { default as handler } from '@/handlers/create-team-handler';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { validatorService, databaseService } from '@/dependencies';
import { default as body } from '@/schemas/create-team-body-schema';
import { createTeamServiceFactory } from '@/business-services/create-team-service';

const createTeamService = createTeamServiceFactory(databaseService, uuid);

export default apiRequestValidatorHandler(validatorService)({
  body
})(handler(createTeamService));
