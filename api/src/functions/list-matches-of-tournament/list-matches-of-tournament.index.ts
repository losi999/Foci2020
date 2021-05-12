import { default as handler } from '@foci2020/api/functions/list-matches-of-tournament/list-matches-of-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { listMatchesOfTournamentServiceFactory } from '@foci2020/api/functions/list-matches-of-tournament/list-matches-of-tournament-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const listMatchesOfTournamentService = listMatchesOfTournamentServiceFactory(databaseService, matchDocumentConverter);

export default cors(authorizer('player')(apiRequestValidator({
  pathParameters,
})(handler(listMatchesOfTournamentService))));
