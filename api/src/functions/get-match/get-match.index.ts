import { default as handler } from '@foci2020/api/functions/get-match/get-match-handler';
import { apiRequestValidator,   authorizer, databaseService, matchDocumentConverter } from '@foci2020/api/dependencies';
import { getMatchServiceFactory } from '@foci2020/api/functions/get-match/get-match-service';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';

const getMatchService = getMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getMatchService)));
