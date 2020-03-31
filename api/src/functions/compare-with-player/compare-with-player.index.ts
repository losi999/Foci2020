import { default as handler } from '@/functions/compare-with-player/compare-with-player-handler';
import { compareWithPlayerServiceFactory } from '@/functions/compare-with-player/compare-with-player-service';
import { authorizer, apiRequestValidator, databaseService, compareDocumentConverter, identityService } from '@/dependencies';
import { pathParameters } from '@/functions/compare-with-player/compare-with-player-schemas';

const compareWithPlayerService = compareWithPlayerServiceFactory(databaseService, identityService, compareDocumentConverter);

export default authorizer('player')(apiRequestValidator({
  pathParameters
})(handler(compareWithPlayerService)));
