import { default as handler } from '@/functions/create-match/create-match-handler';
import { apiRequestValidator, matchDocumentConverter, authorizer, databaseService } from '@/dependencies';
import { default as body } from '@/schemas/match';
import { createMatchServiceFactory } from '@/functions/create-match/create-match-service';

const createMatchService = createMatchServiceFactory(databaseService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createMatchService)));
