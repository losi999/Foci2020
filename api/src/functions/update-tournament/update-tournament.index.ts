import { default as handler } from '@foci2020/api/functions/update-tournament/update-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as body } from '@foci2020/shared/schemas/tournament';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { updateTournamentServiceFactory } from '@foci2020/api/functions/update-tournament/update-tournament-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const updateTournamentService = updateTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default cors(authorizer('admin')(apiRequestValidator({
  body,
  pathParameters,
})(handler(updateTournamentService))));
