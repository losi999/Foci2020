import { default as handler } from '@/handlers/delete-tournament-handler';
import { databaseService, apiRequestValidator, notificationService } from '@/dependencies';
import { deleteTournamentServiceFactory } from '@/business-services/delete-tournament-service';
import { pathParameters } from '@/schemas/delete-tournament-schemas';

const deleteTournamentService = deleteTournamentServiceFactory(databaseService, notificationService);

export default apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService));
