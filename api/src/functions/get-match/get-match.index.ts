import { default as handler } from '@foci2020/api/functions/get-match/get-match-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { getMatchServiceFactory } from '@foci2020/api/functions/get-match/get-match-service';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';

const getMatchService = getMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters, 
})(handler(getMatchService)));
