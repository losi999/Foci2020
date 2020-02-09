import { default as handler } from '@/match/get-match/get-match-handler';
import { apiRequestValidator, matchDocumentConverter, matchDocumentService } from '@/shared/dependencies';
import { getMatchServiceFactory } from '@/match/get-match/get-match-service';
import { pathParameters } from '@/match/get-match/get-match-schemas';

const getMatchService = getMatchServiceFactory(matchDocumentService, matchDocumentConverter);

export default apiRequestValidator({
  pathParameters
})(handler(getMatchService));
