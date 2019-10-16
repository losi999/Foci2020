import { default as handler } from '@/handlers/update-tournament-handler';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { validatorService, databaseService } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-tournament-schemas';
import { updateTournamentServiceFactory } from '@/business-services/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(databaseService);

export default apiRequestValidatorHandler(validatorService)({
  body,
  pathParameters
})(handler(updateTournamentService));
