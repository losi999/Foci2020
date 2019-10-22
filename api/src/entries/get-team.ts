import { default as handler } from '@/handlers/get-team-handler';
import { databaseService } from '@/dependencies';
import { getTeamServiceFactory } from '@/business-services/get-team-service';
import { default as converter } from '@/converters/team-documents-to-response-converter';

const getTeamService = getTeamServiceFactory(databaseService, converter);

export default handler(getTeamService);
