import { default as handler } from '@/handlers/list-teams-handler';
import { teamDocumentConverter, teamDocumentService } from '@/dependencies';
import { listTeamsServiceFactory } from '@/business-services/list-teams-service';

const listTeamsService = listTeamsServiceFactory(teamDocumentService, teamDocumentConverter);

export default handler(listTeamsService);
