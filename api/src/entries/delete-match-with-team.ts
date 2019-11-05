import { default as handler } from '@/handlers/delete-match-with-team-handler';
import { matchDocumentService } from '@/dependencies';
import { deleteMatchWithTeamServiceFactory } from '@/business-services/delete-match-with-team-service';

const deleteMatchWithTeamService = deleteMatchWithTeamServiceFactory(matchDocumentService);

export default handler(deleteMatchWithTeamService);
