import { default as handler } from '@/handlers/list-teams-handler';
import { databaseService } from '@/dependencies';
import { listTeamsServiceFactory } from '@/business-services/list-teams-service';
import { default as converter } from '@/converters/team-documents-to-response-converter';

const listTeamsService = listTeamsServiceFactory(databaseService, converter);

export default handler(listTeamsService);
