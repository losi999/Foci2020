
import { default as handler } from '@foci2020/api/functions/create-team/create-team-handler';
import { apiRequestValidator, authorizer, databaseService, teamDocumentConverter } from '@foci2020/api/dependencies';
import { default as body } from '@foci2020/shared/schemas/team';
import { createTeamServiceFactory } from '@foci2020/api/functions/create-team/create-team-service';

const createTeamService = createTeamServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTeamService)));
