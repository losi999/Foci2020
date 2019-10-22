import { default as handler } from '@/handlers/delete-match-with-team-handler';
import { databaseService } from '@/dependencies';
import { deleteMatchWithTeamServiceFactory } from '@/business-services/delete-match-with-team-service';

const deleteMatchWithTeamService = deleteMatchWithTeamServiceFactory(databaseService);

export default handler(deleteMatchWithTeamService);
