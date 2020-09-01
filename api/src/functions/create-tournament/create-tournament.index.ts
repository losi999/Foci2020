import { default as handler } from '@foci2020/api/functions/create-tournament/create-tournament-handler';
import { apiRequestValidator, authorizer, databaseService, tournamentDocumentConverter } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/tournament';
import { createTournamentServiceFactory } from '@foci2020/api/functions/create-tournament/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTournamentService)));
