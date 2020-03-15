import { default as handler } from '@/functions/list-teams/list-teams-handler';
import { teamDocumentConverter, teamDocumentService, authorizer } from '@/dependencies';
import { listTeamsServiceFactory } from '@/functions/list-teams/list-teams-service';

const listTeamsService = listTeamsServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(handler(listTeamsService));
