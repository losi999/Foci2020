import uuid from 'uuid';
import { default as handler } from '@/handlers/create-tournament-handler';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { validatorService, databaseService } from '@/dependencies';
import { default as body } from '@/schemas/create-tournament-body-schema';
import { createTournamentServiceFactory } from '@/business-services/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(databaseService, uuid);

export default apiRequestValidatorHandler(validatorService)({
  body
})(handler(createTournamentService));
