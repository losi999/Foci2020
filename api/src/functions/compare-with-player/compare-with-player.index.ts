import { default as handler } from '@foci2020/api/functions/compare-with-player/compare-with-player-handler';
import { compareWithPlayerServiceFactory } from '@foci2020/api/functions/compare-with-player/compare-with-player-service';
import { authorizer, apiRequestValidator, databaseService, identityService, compareDocumentConverter } from '@foci2020/api/dependencies';
import { pathParameters } from '@foci2020/api/functions/compare-with-player/compare-with-player-schemas';

const compareWithPlayerService = compareWithPlayerServiceFactory(databaseService, identityService, compareDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(compareWithPlayerService)));
