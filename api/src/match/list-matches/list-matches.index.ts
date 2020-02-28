import { default as handler } from '@/match/list-matches/list-matches-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService, authorizer } from '@/shared/dependencies';
import { queryStringParameters } from '@/match/list-matches/list-matches-schemas';
import { listMatchesServiceFactory } from '@/match/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(matchDocumentService, matchDocumentConverter);

export default authorizer('admin', 'player')(apiRequestValidator({
  queryStringParameters
})(handler(listMatchesService)));
