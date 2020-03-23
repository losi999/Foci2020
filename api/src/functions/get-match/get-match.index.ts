import { default as handler } from '@/functions/get-match/get-match-handler';
import { apiRequestValidator, matchDocumentConverter, databaseService, authorizer } from '@/dependencies';
import { getMatchServiceFactory } from '@/functions/get-match/get-match-service';
import { default as pathParameters } from '@/schemas/match-id';

const getMatchService = getMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getMatchService)));
