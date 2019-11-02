import { default as handler } from '@/handlers/list-teams-handler';
import { databaseService, teamDocumentConverter } from '@/dependencies';
import { listTeamsServiceFactory } from '@/business-services/list-teams-service';

const listTeamsService = listTeamsServiceFactory(databaseService, teamDocumentConverter);

export default handler(listTeamsService);
