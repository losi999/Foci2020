import { default as handler } from '@/functions/get-match/get-match-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService, authorizer } from '@/dependencies';
import { getMatchServiceFactory } from '@/functions/get-match/get-match-service';
import { pathParameters } from '@/functions/get-match/get-match-schemas';

const getMatchService = getMatchServiceFactory(matchDocumentService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getMatchService)));
