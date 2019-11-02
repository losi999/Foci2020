import { default as handler } from '@/handlers/update-match-with-team-handler';
import { matchDocumentService } from '@/dependencies';
import { updateMatchWithTeamServiceFactory } from '@/business-services/update-match-with-team-service';

const updateMatchWithTeamService = updateMatchWithTeamServiceFactory(matchDocumentService);

export default handler(updateMatchWithTeamService);
