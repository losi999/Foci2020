import { default as handler } from '@/functions/list-matches/list-matches-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService, authorizer } from '@/dependencies';
import { queryStringParameters } from '@/functions/list-matches/list-matches-schemas';
import { listMatchesServiceFactory } from '@/functions/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(matchDocumentService, matchDocumentConverter);

export default authorizer('admin', 'player')(apiRequestValidator({
  queryStringParameters
})(handler(listMatchesService)));
