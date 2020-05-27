import { default as handler } from '@foci2020/api/functions/list-teams/list-teams-handler';
import { authorizer, databaseService, teamDocumentConverter } from '@foci2020/api/dependencies';
import { listTeamsServiceFactory } from '@foci2020/api/functions/list-teams/list-teams-service';

const listTeamsService = listTeamsServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(handler(listTeamsService));
