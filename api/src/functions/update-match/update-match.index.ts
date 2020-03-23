import { default as handler } from '@/functions/update-match/update-match-handler';
import { apiRequestValidator, databaseService, matchDocumentConverter, authorizer } from '@/dependencies';
import { default as body } from '@/schemas/match';
import { default as pathParameters } from '@/schemas/match-id';
import { updateMatchServiceFactory } from '@/functions/update-match/update-match-service';

const updateMatchService = updateMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateMatchService)));
