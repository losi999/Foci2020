import { default as handler } from '@foci2020/api/functions/delete-tournament/delete-tournament-handler';
import { apiRequestValidator,  authorizer, databaseService } from '@foci2020/api/dependencies';
import { deleteTournamentServiceFactory } from '@foci2020/api/functions/delete-tournament/delete-tournament-service';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';

const deleteTournamentService = deleteTournamentServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService)));
