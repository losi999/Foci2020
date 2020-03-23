import { default as handler } from '@/functions/delete-tournament/delete-tournament-handler';
import { apiRequestValidator, databaseService, authorizer } from '@/dependencies';
import { deleteTournamentServiceFactory } from '@/functions/delete-tournament/delete-tournament-service';
import { default as pathParameters } from '@/schemas/tournament-id';

const deleteTournamentService = deleteTournamentServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteTournamentService)));
