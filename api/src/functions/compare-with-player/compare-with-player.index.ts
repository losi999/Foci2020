import { default as handler } from '@foci2020/api/functions/compare-with-player/compare-with-player-handler';
import { compareWithPlayerServiceFactory } from '@foci2020/api/functions/compare-with-player/compare-with-player-service';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { identityService } from '@foci2020/shared/dependencies/services/identity-service';
import { compareDocumentConverter } from '@foci2020/shared/dependencies/converters/compare-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { pathParameters } from '@foci2020/api/functions/compare-with-player/compare-with-player-schemas';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const compareWithPlayerService = compareWithPlayerServiceFactory(databaseService, identityService, compareDocumentConverter);

export default cors(authorizer('player')(apiRequestValidator({
  pathParameters,
})(handler(compareWithPlayerService))));
