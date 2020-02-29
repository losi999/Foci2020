import { default as handler } from '@/functions/get-team/get-team-handler';
import { apiRequestValidator, teamDocumentConverter, teamDocumentService, authorizer } from '@/dependencies';
import { getTeamServiceFactory } from '@/functions/get-team/get-team-service';
import { pathParameters } from '@/functions/get-team/get-team-schemas';

const getTeamService = getTeamServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTeamService)));
