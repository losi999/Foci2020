import { default as handler } from '@/functions/get-team/get-team-handler';
import { apiRequestValidator, teamDocumentConverter, databaseService, authorizer } from '@/dependencies';
import { getTeamServiceFactory } from '@/functions/get-team/get-team-service';
import { default as pathParameters } from '@/schemas/team-id';

const getTeamService = getTeamServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTeamService)));
