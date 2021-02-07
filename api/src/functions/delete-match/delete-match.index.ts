import { default as handler } from '@foci2020/api/functions/delete-match/delete-match-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { deleteMatchServiceFactory } from '@foci2020/api/functions/delete-match/delete-match-service';
import { default as pathParameters } from '@foci2020/shared/schemas/match-id';

const deleteMatchService = deleteMatchServiceFactory(databaseService);

export default authorizer('admin')(apiRequestValidator({
  pathParameters, 
})(handler(deleteMatchService)));
