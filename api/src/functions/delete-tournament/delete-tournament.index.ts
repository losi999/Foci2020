import { default as handler } from '@foci2020/api/functions/delete-tournament/delete-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { deleteTournamentServiceFactory } from '@foci2020/api/functions/delete-tournament/delete-tournament-service';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const deleteTournamentService = deleteTournamentServiceFactory(databaseService);

export default cors(authorizer('admin')(apiRequestValidator({
  pathParameters,
})(handler(deleteTournamentService))));
