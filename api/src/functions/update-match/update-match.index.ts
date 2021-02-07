import { default as handler } from '@foci2020/api/functions/update-match/update-match-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as body } from '@foci2020/shared/schemas/match';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';
import { updateMatchServiceFactory } from '@foci2020/api/functions/update-match/update-match-service';

const updateMatchService = updateMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters,
})(handler(updateMatchService)));
