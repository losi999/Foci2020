import { default as handler } from '@foci2020/api/functions/get-team/get-team-handler';
import { apiRequestValidator,   authorizer, databaseService, teamDocumentConverter } from '@foci2020/api/dependencies';
import { getTeamServiceFactory } from '@foci2020/api/functions/get-team/get-team-service';
import { default as pathParameters } from '@foci2020/shared/schemas/team-id';

const getTeamService = getTeamServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  pathParameters
})(handler(getTeamService)));
