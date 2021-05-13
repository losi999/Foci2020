import { default as handler } from '@foci2020/api/functions/set-default-tournament/set-default-tournament-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { setDefaultTournamentServiceFactory } from '@foci2020/api/functions/set-default-tournament/set-default-tournament-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';
import { settingDocumentConverter } from '@foci2020/shared/dependencies/converters/setting-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { default as body } from '@foci2020/shared/schemas/tournament-id';

const setDefaultTournamentService = setDefaultTournamentServiceFactory(databaseService, settingDocumentConverter);

export default cors(authorizer('admin')(apiRequestValidator({
  body,
})(handler(setDefaultTournamentService))));
