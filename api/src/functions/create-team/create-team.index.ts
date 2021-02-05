
import { default as handler } from '@foci2020/api/functions/create-team/create-team-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { apiRequestValidator } from '@foci2020/api/dependencies/handlers/api-request-validator-handler';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { default as body } from '@foci2020/shared/schemas/team';
import { createTeamServiceFactory } from '@foci2020/api/functions/create-team/create-team-service';

const createTeamService = createTeamServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(apiRequestValidator({
  body
})(handler(createTeamService)));
