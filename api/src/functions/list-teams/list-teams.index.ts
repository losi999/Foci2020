import { default as handler } from '@foci2020/api/functions/list-teams/list-teams-handler';
import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { authorizer } from '@foci2020/api/dependencies/handlers/authorizer-handler';
import { listTeamsServiceFactory } from '@foci2020/api/functions/list-teams/list-teams-service';

const listTeamsService = listTeamsServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(handler(listTeamsService));
