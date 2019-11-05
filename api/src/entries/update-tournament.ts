import { default as handler } from '@/handlers/update-tournament-handler';
import { apiRequestValidator, notificationService, tournamentDocumentService } from '@/dependencies';
import { body, pathParameters } from '@/schemas/update-tournament-schemas';
import { updateTournamentServiceFactory } from '@/business-services/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(tournamentDocumentService, notificationService);

export default apiRequestValidator({
  body,
  pathParameters
})(handler(updateTournamentService));
