import { default as handler } from '@foci2020/api/functions/update-team/update-team-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as body } from '@foci2020/shared/schemas/team';
import { default as pathParameters } from '@foci2020/shared/schemas/team-id';
import { updateTeamServiceFactory } from '@foci2020/api/functions/update-team/update-team-service';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const updateTeamService = updateTeamServiceFactory(databaseService, teamDocumentConverter);

export default cors(authorizer('admin')(apiRequestValidator({
  body,
  pathParameters,
})(handler(updateTeamService))));
