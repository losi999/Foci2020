import { default as handler } from '@foci2020/api/functions/update-match/update-match-handler';
import { apiRequestValidator, authorizer, databaseService, matchDocumentConverter } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/match';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';
import { updateMatchServiceFactory } from '@foci2020/api/functions/update-match/update-match-service';

const updateMatchService = updateMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateMatchService)));
