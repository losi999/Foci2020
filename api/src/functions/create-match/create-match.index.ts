import { default as handler } from '@/functions/create-match/create-match-handler';
import { apiRequestValidator, matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter, authorizer } from '@/dependencies';
import { body } from '@/functions/create-match/create-match-schemas';
import { createMatchServiceFactory } from '@/functions/create-match/create-match-service';

const createMatchService = createMatchServiceFactory(matchDocumentService, teamDocumentService, tournamentDocumentService, matchDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createMatchService)));
