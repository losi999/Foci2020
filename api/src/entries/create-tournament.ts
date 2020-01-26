import { default as handler } from '@/handlers/create-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, tournamentDocumentConverter } from '@/dependencies';
import { body } from '@/schemas/create-tournament-schemas';
import { createTournamentServiceFactory } from '@/business-services/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default apiRequestValidator({
  body
})(handler(createTournamentService));
