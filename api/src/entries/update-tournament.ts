import { default as handler } from '@/handlers/update-tournament-handler';
import { databaseService, apiRequestValidator, notificationService } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-tournament-schemas';
import { updateTournamentServiceFactory } from '@/business-services/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(databaseService, notificationService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateTournamentService));
