import { default as handler } from '@/functions/delete-match/delete-match-handler';
import { apiRequestValidator, matchDocumentService, authorizer } from '@/dependencies';
import { deleteMatchServiceFactory } from '@/functions/delete-match/delete-match-service';
import { pathParameters } from '@/functions/delete-match/delete-match-schemas';

const deleteMatchService = deleteMatchServiceFactory(matchDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteMatchService)));
