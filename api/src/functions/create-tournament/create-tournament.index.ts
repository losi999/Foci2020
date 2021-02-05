import { default as handler } from '@foci2020/api/functions/create-tournament/create-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as body } from '@foci2020/shared/schemas/tournament';
import { createTournamentServiceFactory } from '@foci2020/api/functions/create-tournament/create-tournament-service';

const createTournamentService = createTournamentServiceFactory(databaseService, tournamentDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTournamentService)));
