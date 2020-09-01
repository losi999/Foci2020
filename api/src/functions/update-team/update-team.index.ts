import { default as handler } from '@foci2020/api/functions/update-team/update-team-handler';
import { apiRequestValidator, authorizer, databaseService, teamDocumentConverter } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/team';
import { default as pathParameters } from '@foci2020/shared/schemas/team-id';
import { updateTeamServiceFactory } from '@foci2020/api/functions/update-team/update-team-service';

const updateTeamService = updateTeamServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body,
  pathParameters
})(handler(updateTeamService)));
