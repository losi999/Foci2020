import { default as handler } from '@/functions/create-tournament/create-tournament-handler';
import { apiRequestValidator, databaseService, tournamentDocumentConverter, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/tournament';
import { createTournamentServiceFactory } from '@/functions/create-tournament/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTournamentService)));
