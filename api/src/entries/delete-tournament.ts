import { default as handler } from '@/handlers/delete-tournament-handler';
import { databaseService, apiRequestValidator } from '@/dependencies';
import { deleteTournamentServiceFactory } from '@/business-services/delete-tournament-service';
import { pathParameters } from '@/schemas/delete-tournament-schemas';

const deleteTournamentService = deleteTournamentServiceFactory(databaseService);

export default apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService));
