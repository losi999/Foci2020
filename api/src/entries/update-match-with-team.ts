import { default as handler } from '@/handlers/update-match-with-team-handler';
import { databaseService } from '@/dependencies';
import { updateMatchWithTeamServiceFactory } from '@/business-services/update-match-with-team-service';

const updateMatchWithTeamService = updateMatchWithTeamServiceFactory(databaseService);

export default handler(updateMatchWithTeamService);
