import { default as handler } from '@/functions/delete-match/delete-match-handler';
import { apiRequestValidator, databaseService, authorizer } from '@/dependencies';
import { deleteMatchServiceFactory } from '@/functions/delete-match/delete-match-service';
import { default as pathParameters } from '@/schemas/match-id';

const deleteMatchService = deleteMatchServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(deleteMatchService)));
