import { default as handler } from '@/functions/list-teams/list-teams-handler';
import { teamDocumentConverter, databaseService, authorizer } from '@/dependencies';
import { listTeamsServiceFactory } from '@/functions/list-teams/list-teams-service';

const listTeamsService = listTeamsServiceFactory(databaseService, teamDocumentConverter);

export default authorizer('admin')(handler(listTeamsService));
