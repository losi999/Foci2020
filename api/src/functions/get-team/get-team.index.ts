import { default as handler } from '@foci2020/api/functions/get-team/get-team-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { getTeamServiceFactory } from '@foci2020/api/functions/get-team/get-team-service';
import { default as pathParameters } from '@foci2020/shared/schemas/team-id';
import { cors } from '@foci2020/api/dependencies/handlers/cors-handler';

const getTeamService = getTeamServiceFactory(databaseService, teamDocumentConverter);

export default cors(authorizer('admin')(apiRequestValidator({
  pathParameters,
})(handler(getTeamService))));
