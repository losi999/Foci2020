import { default as handler } from '@foci2020/api/functions/update-tournament/update-tournament-handler';
import { apiRequestValidator, authorizer, databaseService, tournamentDocumentConverter } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/tournament';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { updateTournamentServiceFactory } from '@foci2020/api/functions/update-tournament/update-tournament-service';

const updateTournamentService = updateTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateTournamentService)));
