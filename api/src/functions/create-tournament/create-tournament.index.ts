import { default as handler } from '@/functions/create-tournament/create-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, tournamentDocumentConverter, authorizer } from '@/dependencies';
import { body } from '@/functions/create-tournament/create-tournament-schemas';
import { createTournamentServiceFactory } from '@/functions/create-tournament/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTournamentService)));
