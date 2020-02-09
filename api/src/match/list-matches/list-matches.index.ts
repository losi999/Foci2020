import { default as handler } from '@/match/list-matches/list-matches-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService } from '@/shared/dependencies';
import { queryStringParameters } from '@/match/list-matches/list-matches-schemas';
import { listMatchesServiceFactory } from '@/match/list-matches/list-matches-service';

const listMatchesService = listMatchesServiceFactory(matchDocumentService, matchDocumentConverter);

export default apiRequestValidator({
  queryStringParameters
})(handler(listMatchesService));
