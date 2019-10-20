import { default as handler } from '@/handlers/list-teams-handler';
import { databaseService } from '@/dependencies';
import { listTeamsServiceFactory } from '@/business-services/list-teams-service';

const listTeamsService = listTeamsServiceFactory(databaseService);

export default handler(listTeamsService);
