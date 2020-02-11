import { default as handler } from '@/match/delete-match/delete-match-handler';
import { apiRequestValidator, matchDocumentService, authorizer } from '@/shared/dependencies';
import { deleteMatchServiceFactory } from '@/match/delete-match/delete-match-service';
import { pathParameters } from '@/match/delete-match/delete-match-schemas';

const deleteMatchService = deleteMatchServiceFactory(matchDocumentService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteMatchService)));
