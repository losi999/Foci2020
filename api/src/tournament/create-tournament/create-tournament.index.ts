import { default as handler } from '@/tournament/create-tournament/create-tournament-handler';
import { apiRequestValidator, tournamentDocumentService, tournamentDocumentConverter, authorizer } from '@/shared/dependencies';
import { body } from '@/tournament/create-tournament/create-tournament-schemas';
import { createTournamentServiceFactory } from '@/tournament/create-tournament/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(tournamentDocumentService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTournamentService)));
