import { default as handler } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { standingDocumentConverter } from '@foci2020/shared/dependencies/converters/standing-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as pathParameters } from '@foci2020/shared/schemas/tournament-id';
import { listStandingsOfTournamentFactory } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const listStandingsOfTournamentService = listStandingsOfTournamentFactory(databaseService, standingDocumentConverter);

export default cors(authorizer('player')(apiRequestValidator({
  pathParameters,
})(handler(listStandingsOfTournamentService))));
