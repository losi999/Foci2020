import { default as handler } from '@/team/list-teams/list-teams-handler';
import { teamDocumentConverter, teamDocumentService, authorizer } from '@/shared/dependencies';
import { listTeamsServiceFactory } from '@/team/list-teams/list-teams-service';

const listTeamsService = listTeamsServiceFactory(teamDocumentService, teamDocumentConverter);

export default authorizer('admin')(handler(listTeamsService));
