import { default as handler } from '@foci2020/api/functions/create-match/create-match-handler';
import { apiRequestValidator, authorizer, databaseService, matchDocumentConverter } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/match';
import { createMatchServiceFactory } from '@foci2020/api/functions/create-match/create-match-service';

const createMatchService = createMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createMatchService)));
