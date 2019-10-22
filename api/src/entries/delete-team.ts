import { default as handler } from '@/handlers/delete-team-handler';
import { databaseService } from '@/dependencies';
import { deleteTeamServiceFactory } from '@/business-services/delete-team-service';

const deleteTeamService = deleteTeamServiceFactory(databaseService);

export default handler(deleteTeamService);
