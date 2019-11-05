import { default as handler } from '@/handlers/get-tournament-handler';
import { apiRequestValidator, tournamentDocumentConverter, tournamentDocumentService } from '@/dependencies';
import { getTournamentServiceFactory } from '@/business-services/get-tournament-service';
import { pathParameters } from '@/schemas/get-tournament-schemas';

const getTournamentService = getTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default apiRequestValidator({
  pathParameters
})(handler(getTournamentService));
